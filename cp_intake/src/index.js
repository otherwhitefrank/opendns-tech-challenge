export util from './util';
export logger from './log';
export validate from './validate';

"use strict";

import { parse_cp } from './util';
import { CP_Parser } from './util';
import { ODNS_Mapper } from './util';
import { streamToString } from './util';
import { ODNS_Validator } from './validate';
import { validateBody } from './validate';
var logger = require('./log');

var amqp = require('amqplib/callback_api');
var express = require('express');
var app = express();

var MAX_RETRIES = 5;

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

amqp.connect('amqp://rabbit:5672', {heartbeat: 5}, function(err, conn) {
  if (err) {
    logger.error("Unable to acquire RabbitMQ server: " + err);
    process.exit(1);
  }

  conn.createConfirmChannel(function(err, ch) {
    var q = 'opendns';
    ch.assertQueue(q, {durable: true});

    app.post('/checkpoint', function (req, res) {
      var parser = new CP_Parser();
      var odns_mapper = new ODNS_Mapper();

      streamToString(req.pipe(parser).pipe(odns_mapper), function(json_str) {
        let json = JSON.parse(json_str);

        let validateResults = validateBody(json, ODNS_Validator);

        if (validateResults.valid) {
          //Insert into RabbitMQ
          tryRabbitMQPostUntilSuccess(0, json_str, q, ch, {}, function(err, ok) {
            if (err) {
              logger.error(" [x] Can't connect to RabbitMQ after repeated attempts, exiting...");
              res.status(500).end();
              process.exit(1);
            } else {
              logger.info(" [x] Sent: " + json_str);
              res.status(202).end();
            }
          });
        } else {
          logger.error(" [x] Bad submissions, unable to parse: " + JSON.stringify(validateResults));
          handleBadJson(res, validateResults); //Returns 400 with some error info
        }
      });
    });

  });

  conn.on('error', function(err) {
    logger.error(" [x] Error from RabbitMQ server, err: " + err);
    process.exit(1); //Let supervisord attempt to restart
  });
});

function tryRabbitMQPostUntilSuccess(count, message, q, ch, options, callback) {
  ch.sendToQueue(q, new Buffer(message), {},
    function(err, ok) {
      if (err !== null && count <= MAX_RETRIES) {
        //RabbitMQ nack
        logger.error(" [x] Problem sending to RabbitMQ, retrying... attempt: " + count);
        tryRabbitMQPostUntilSuccess(count + 1, message, q, ch, options, callback);
      } else if (err !== null && count >= MAX_RETRIES) {
        //To many retries
        callback(err, ok);
      } else {
      //RabbitMQ ack
        callback(null, ok); //Success
      }
    });
}

app.listen(3000, function () {
  logger.info('Check Point integration API waiting on port 3000...');
});

