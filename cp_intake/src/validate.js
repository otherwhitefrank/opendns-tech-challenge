'use strict';

var logger = require('winston'); //Acquires default logger configured in index.js
var tcomb = require('tcomb');
var tcomb_validation = require('tcomb-validation');

//These are required by OpenDNS Api, anything extra will just be taken as is...
export var ODNS_Validator = tcomb.struct({
  deviceId: tcomb.Str,
  deviceVersion: tcomb.Str,
  eventTime: tcomb.Str,
  alertTime: tcomb.Str,
  dstDomain: tcomb.Str,
  dstUrl: tcomb.Str,
  protocolVersion: tcomb.Str,
  providerName: tcomb.Str
});

export function validateBody(json, schema) {
  var valResults = tcomb_validation.validate(json, schema);
  return {
    valid: valResults.isValid(),
    errors: valResults.errors
  };
};
