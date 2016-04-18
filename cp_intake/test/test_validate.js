import { expect } from 'chai';
import { assert } from 'chai';
import { should } from 'chai';
import { ODNS_Validator } from '../lib/validate';
import { validateBody } from '../lib/validate';

var good_obj = '{"protocolVersion":"1.0a","providerName":"Security Platform","eventTime":"2014-07-14T21:38:52.000Z","alertTime":"2016-04-17T18:45:42.255Z","dstUrl":"http://alejandrin.biz","dstDomain":"alejandrin.biz","deviceId":"147.80.118.52","deviceVersion":"This is Check Points software version R77.10 - Build 243","dstIp":"228.129.60.153","eventSeverity":"4","eventType":"URL reputation","eventDescription":"Communication with C&C site","eventHash":"[0x30c5e8f1,0xb,0xf4da2510,0x2eaa7e55]","src":"80.34.229.243"}';


describe('validate', () => {
  it(`ODNS_Validator should successfully validate a good object`, () => {
    let parsed_json = JSON.parse(good_obj);
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.be.true;
  });

  it(`ODNS_Validator should successfully validate object with additional fields`, () => {
    let parsed_json = JSON.parse(good_obj);
    parsed_json["a_new_field"] = "some new data";
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.be.true;
  });

  it(`ODNS_Validator should not validate without deviceVersion`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["deviceVersion"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;
  });

  it(`ODNS_Validator should not validate without eventTime`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["eventTime"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;  });

  it(`ODNS_Validator should not validate without alertTime`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["alertTime"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;
  });

  it(`ODNS_Validator should not validate without dstDomain`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["dstDomain"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;
  });

  it(`ODNS_Validator should not validate without dstUrl`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["dstUrl"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;
  });

  it(`ODNS_Validator should not validate without protocolVersion`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["protocolVersion"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;
  });

  it(`ODNS_Validator should not validate without providerName`, () => {
    let parsed_json = JSON.parse(good_obj);
    delete parsed_json["providerName"]; //Erase a few required fields
    let val_results = validateBody(parsed_json, ODNS_Validator);

    expect(val_results.valid).to.not.be.true;
  });
});
