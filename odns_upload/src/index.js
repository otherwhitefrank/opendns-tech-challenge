"use strict";

var logger = require('./log');

var amqp = require('amqplib/callback_api');
var request = require('request');

amqp.connect('amqp://rabbit:5672', function(err, conn) {
  if (err) {
    logger.error(" [x] Unable to acquire RabbitMQ server: " + err);
    process.exit(1);
  }

  conn.createChannel(function(err, ch) {
    var q = 'opendns';

    ch.assertQueue(q, {durable: true});
    ch.consume(q, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;
      var content = msg.content.toString();

      logger.info(" [x] Received %s", content);
      logger.info(" [x] Forwarding payload to OpenDNS S-Platform...");

      request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://s-platform.api.opendns.com/1.0/events?customerKey=ca9c0847-0e85-41f2-ba6a-937c66789827',
        body:    content,
        timeout: 1000       //Timeout in 1000ms
      }, function(error, response, body){

        //Based on error/success of the API upload the consumer will ack/nack to RabbitMQ
        //If the 1000ms Timeout to OpenDNS S-Platform API is reached then the consumer does not acknowledge
        //completion of the message. This causes it to be resubmitted in the message queue for another consumer
        //to pick up and retry with.
        if (error) {
          logger.error(" [x] Error or didn't receive response before timeout from OpenDNS Server, err: " + error);
          ch.nack(msg);
        } else {
          if (response.statusCode === 200 || response.statusCode === 202) {
            logger.info(" [x] Success response from OpenDNS S-Platform: %s", body);
          } else {
            //Abnormal response, API did not accept request
            logger.info(" [x] Bad Response from OpenDNS S-Platform: %s", body);
          }

          ch.ack(msg);
        }
      });
    }, {noAck: false});
  });

  conn.on('error', function(err) {
    logger.error(" [x] Error from RabbitMQ server, err: " + err);
    process.exit(1);
  });
});
