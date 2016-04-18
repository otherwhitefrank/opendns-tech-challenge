'use strict';

var _chai = require('chai');

var _validate = require('../lib/validate');

var good_obj = '{"protocolVersion":"1.0a","providerName":"Security Platform","eventTime":"2014-07-14T21:38:52.000Z","alertTime":"2016-04-17T18:45:42.255Z","dstUrl":"http://alejandrin.biz","dstDomain":"alejandrin.biz","deviceId":"147.80.118.52","deviceVersion":"This is Check Points software version R77.10 - Build 243","dstIp":"228.129.60.153","eventSeverity":"4","eventType":"URL reputation","eventDescription":"Communication with C&C site","eventHash":"[0x30c5e8f1,0xb,0xf4da2510,0x2eaa7e55]","src":"80.34.229.243"}';

describe('validate', function () {
  it('ODNS_Validator should successfully validate a good object', function () {
    var parsed_json = JSON.parse(good_obj);
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.be.true;
  });

  it('ODNS_Validator should successfully validate object with additional fields', function () {
    var parsed_json = JSON.parse(good_obj);
    parsed_json["a_new_field"] = "some new data";
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.be.true;
  });

  it('ODNS_Validator should not validate without deviceVersion', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["deviceVersion"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });

  it('ODNS_Validator should not validate without eventTime', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["eventTime"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });

  it('ODNS_Validator should not validate without alertTime', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["alertTime"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });

  it('ODNS_Validator should not validate without dstDomain', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["dstDomain"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });

  it('ODNS_Validator should not validate without dstUrl', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["dstUrl"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });

  it('ODNS_Validator should not validate without protocolVersion', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["protocolVersion"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });

  it('ODNS_Validator should not validate without providerName', function () {
    var parsed_json = JSON.parse(good_obj);
    delete parsed_json["providerName"]; //Erase a few required fields
    var val_results = (0, _validate.validateBody)(parsed_json, _validate.ODNS_Validator);

    (0, _chai.expect)(val_results.valid).to.not.be.true;
  });
});
//# sourceMappingURL=test_validate.js.map