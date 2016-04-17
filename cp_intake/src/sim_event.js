#!/usr/local/bin/node
'use strict';

var request = require('request');
import { fake_cp } from './fake_cp';

var fake_event = fake_cp();

request.post({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'http://localhost:3000/checkpoint',
    body:    fake_event
}, function(error, response, body){
    console.log(body);
});
