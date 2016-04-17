export util from './util';

"use strict";

import { parse_cp } from './util';
import { CP_Parser } from './util';
import { ODNS_Mapper } from './util';
import { streamToString } from './util';

var amqp = require('amqplib/callback_api');
var express = require('express');
var tcomb = require('tcomb');
var tcomb_validation = require('tcomb-validation');
var app = express();

//These are required by OpenDNS Api, anything extra will just be taken as is...
var ODNS_Validator = tcomb.struct({
  deviceId: tcomb.Str,
  deviceVersion: tcomb.Str,
  eventTime: tcomb.Str,
  alertTime: tcomb.Str,
  dstDomain: tcomb.Str,
  dstUrl: tcomb.Str,
  protocolVersion: tcomb.Str,
  providerName: tcomb.Str
});

var validateBody = function(json, schema) {
  var valResults = tcomb_validation.validate(json, schema);
  return {
    valid: valResults.isValid(),
    errors: valResults.errors
  };
};

var handleBadJson = function (res, validateResults) {
  //Give the user a hint where there is incorrect data.
  //This is a little weird cause it is going to refer to the ODNS_Mapper object
  //TODO: Make this return results based on user's submission before transormation pipeline

  var errorArray = Array();
  for (var i = validateResults.errors.length - 1; i >= 0; i--) {
    var keyPath = validateResults.errors[i].path.join("/");

    var tempError = {
      error_type: "Invalid data type (should usually be string)",
      details: {
        message: "Invalid value at key: " + keyPath,
        key: keyPath
      }
    };

    errorArray.push(tempError);
  }

  var jsonData = {
    errors: errorArray
  };

  res.status(400).send(jsonData).end();
}

app.post('/checkpoint', function (req, res) {
  var parser = new CP_Parser();
  var odns_mapper = new ODNS_Mapper();

  //Pipe into transform
  //use validateBody

  streamToString(req.pipe(parser).pipe(odns_mapper), function(json_str) {
    let json = JSON.parse(json_str);

    let validateResults = validateBody(json, ODNS_Validator);

    if (validateResults.valid) {
      //Insert into RabbitMQ
      amqp.connect('amqp://192.168.64.7:5672', function(err, conn) {
        if (err) {
          console.log("Error!" + err);
          process.exit(1);
        }

        conn.createChannel(function(err, ch) {
          var q = 'opendns';

          ch.assertQueue(q, {durable: false});
          ch.sendToQueue(q, new Buffer(json_str));
          console.log(" [x] Sent: " + json_str);


          res.status(202).end();
          setTimeout(function() { conn.close(); }, 500); //TODO: Fix rabbit startup/exit
        });
      });
    } else {
      handleBadJson(res, validateResults); //Returns 400 with some error info
    }
  });
});

app.listen(3000, function () {
  console.log('Check Point integration API waiting on port 3000...');
});

