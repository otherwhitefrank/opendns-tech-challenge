export util from './util';

var amqp = require('amqplib/callback_api');
var request = require('request');

amqp.connect('amqp://192.168.64.7:5672', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'opendns';

    ch.assertQueue(q, {durable: false});
    ch.consume(q, function(msg) {
      var secs = msg.content.toString().split('.').length - 1;

      var content = msg.content.toString();

      console.log(" [x] Received %s", content);

      request.post({
        headers: {'content-type' : 'application/json'},
        url:     'https://s-platform.api.opendns.com/1.0/events?customerKey=ca9c0847-0e85-41f2-ba6a-937c66789827',
        body:    content
      }, function(error, response, body){
        console.log(" [x] Forwarding payload to OpenDNS S-Platform...");
        console.log(" [x] Response from OpenDNS S-Platform: %s", body);
      });

      setTimeout(function() {
        console.log(" [x] Done");
        ch.ack(msg);
      }, secs * 1000);
    }, {noAck: false});
  });
});
