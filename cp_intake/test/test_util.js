import { expect } from 'chai';
import { assert } from 'chai';
import { should } from 'chai';
import { parse_cp } from '../lib/util';
import { ODNS_Mapper } from '../lib/util';
import { CP_Parser } from '../lib/util';
import { streamToString } from '../lib/util';
import { fake_cp } from '../lib/fake_cp';

var stream = require('stream');
var Readable = stream.Readable;

describe('util', () => {
  it(`CP_Parser should transform CP Event to JSON`, () => {
    let dummy_event = fake_cp();
    let json_stream = parse_cp(dummy_event);

    streamToString(json_stream, function(str) {
      expect(JSON.parse(str)).to.not.throw(Error);
    });
  });

  it(`CP_Parser should not error with bad data`, () => {
    var bad_data =
      `2014-07-14T21:38:52+0000 6Mar2014 14:07:24 redirect$ # ## % % # # @!1 ;;; / ;; 192.168.115.177 <eth1 alert web_client_type: Microsoft IE 8.0; ;;;; /// + 123 resource: http://leiw6.ayid.vnz/za/images/threatwiki/pages/TestAntiBotBlade.html;  ;;; # @ ! $ 5 7 , ; :src: 192.168.35.121; dst: 23.203.225.174; proto: tcp; session_id: {0x5318f19c,0x2,0xb17361d1,0xc0000000}; Protection name: Check Point - Testing Bot; malware_family: Check Point; Source OS: Windows; Confidence Level: 5; severity: 2; malware_action: Communication with C&C site; rule_uid: {49787C9F-D241-4E6B-91B3-402B56026391}; Protection Type: URL reputation; malware_rule_id: {0000000A-00BC-004E-9379-B356E398F290}; protection_id: 00233CFEE; refid: 0; log_id: 2; proxy_src_ip: 192.168.35.121; scope: 192.168.35.121; user: alice smith (alice)(+); src_user_name: alice smith (alice)(+); src_machine_name: xp1@opsec.com; snid: b7e71f09; product: Anti Malware; service: http; s_port: 3370; device_version: This is Check Points software version R77.10 - Build 243;`;

    let json_stream = parse_cp(bad_data);

    streamToString(json_stream, function(str) {
      var json = {};
      expect(json = JSON.parse(str)).to.not.throw(Error);
    });
  });

  it(`CP_Parser should parse what it can with bad data`, () => {
    var bad_data =
      `2014-07-14T21:38:52+0000 6Mar2014 14:07:24 redirect$ # ## % % # # @!1 ;;; / ;; 192.168.115.177 <eth1 alert web_client_type: Microsoft IE 8.0; ;;;; /// + 123 resource: http://leiw6.ayid.vnz/za/images/threatwiki/pages/TestAntiBotBlade.html;  ;;; # @ ! $ 5 7 , ; :src: 192.168.35.121; dst: 23.203.225.174; proto: tcp; session_id: {0x5318f19c,0x2,0xb17361d1,0xc0000000}; Protection name: Check Point - Testing Bot; malware_family: Check Point; Source OS: Windows; Confidence Level: 5; severity: 2; malware_action: Communication with C&C site; rule_uid: {49787C9F-D241-4E6B-91B3-402B56026391}; Protection Type: URL reputation; malware_rule_id: {0000000A-00BC-004E-9379-B356E398F290}; protection_id: 00233CFEE; refid: 0; log_id: 2; proxy_src_ip: 192.168.35.121; scope: 192.168.35.121; user: alice smith (alice)(+); src_user_name: alice smith (alice)(+); src_machine_name: xp1@opsec.com; snid: b7e71f09; product: Anti Malware; service: http; s_port: 3370; device_version: This is Check Points software version R77.10 - Build 243;`;

    let json_stream = parse_cp(bad_data);

    streamToString(json_stream, function(str) {
      var json = JSON.parse(str);
      expect(json).to.contain.property('malware_family');
    });
  });

  it(`CP_Parser should parse event into intermediate json`, () => {
    let data =
      '2014-07-14T21:38:52+0000 6Mar2014 14:07:24 redirect 192.168.115.177 <eth1 alert web_client_type: Microsoft IE 8.0; resource: http://leiw6.ayid.vnz/za/images/threatwiki/pages/TestAntiBotBlade.html; src: 192.168.35.121; dst: 23.203.225.174; proto: tcp; session_id: {0x5318f19c,0x2,0xb17361d1,0xc0000000}; Protection name: Check Point - Testing Bot; malware_family: Check Point; Source OS: Windows; Confidence Level: 5; severity: 2; malware_action: Communication with C&C site; rule_uid: {49787C9F-D241-4E6B-91B3-402B56026391}; Protection Type: URL reputation; malware_rule_id: {0000000A-00BC-004E-9379-B356E398F290}; protection_id: 00233CFEE; refid: 0; log_id: 2; proxy_src_ip: 192.168.35.121; scope: 192.168.35.121; user: alice smith (alice)(+); src_user_name: alice smith (alice)(+); src_machine_name: xp1@opsec.com; snid: b7e71f09; product: Anti Malware; service: http; s_port: 3370; device_version: This is Check Points software version R77.10 - Build 243;';

    let should_match = '{"event_creation": "2014-07-14T21:38:52+0000","date2": "6Mar2014","date3": "14:07:24","action_type": "redirect","checkpoint_server_ip": "192.168.115.177","device_desc": "<eth1","log_level": "alert","web_client_type": "Microsoft IE 8.0","resource": "http://leiw6.ayid.vnz/za/images/threatwiki/pages/TestAntiBotBlade.html","src": "192.168.35.121","dst": "23.203.225.174","proto": "tcp","session_id": "{0x5318f19c,0x2,0xb17361d1,0xc0000000}","Protection name": "Check Point - Testing Bot","malware_family": "Check Point","Source OS": "Windows","Confidence Level": "5","severity": "2","malware_action": "Communication with C&C site","rule_uid": "{49787C9F-D241-4E6B-91B3-402B56026391}","Protection Type": "URL reputation","malware_rule_id": "{0000000A-00BC-004E-9379-B356E398F290}","protection_id": "00233CFEE","refid": "0","log_id": "2","proxy_src_ip": "192.168.35.121","scope": "192.168.35.121","user": "alice smith (alice)(+)","src_user_name": "alice smith (alice)(+)","src_machine_name": "xp1@opsec.com","snid": "b7e71f09","product": "Anti Malware","service": "http","s_port": "3370","device_version": "This is Check Points software version R77.10 - Build 243"}';
    let readable_stream = new Readable();
    readable_stream.push(data);
    readable_stream.push(null);
    let parser = new CP_Parser();

    streamToString(readable_stream.pipe(parser), function(out_str) {
      var json = JSON.parse(out_str);
      expect(out_str).to.equal(should_match);
    });
  });

  it(`ODNS_Mapping should parse intermediate json into correct API json`, () => {
    let data = '{"event_creation": "2014-07-14T21:38:52+0000","date2": "6Mar2014","date3": "14:07:24","action_type": "redirect","checkpoint_server_ip": "192.168.115.177","device_desc": "<eth1","log_level": "alert","web_client_type": "Microsoft IE 8.0","resource": "http://leiw6.ayid.vnz/za/images/threatwiki/pages/TestAntiBotBlade.html","src": "192.168.35.121","dst": "23.203.225.174","proto": "tcp","session_id": "{0x5318f19c,0x2,0xb17361d1,0xc0000000}","Protection name": "Check Point - Testing Bot","malware_family": "Check Point","Source OS": "Windows","Confidence Level": "5","severity": "2","malware_action": "Communication with C&C site","rule_uid": "{49787C9F-D241-4E6B-91B3-402B56026391}","Protection Type": "URL reputation","malware_rule_id": "{0000000A-00BC-004E-9379-B356E398F290}","protection_id": "00233CFEE","refid": "0","log_id": "2","proxy_src_ip": "192.168.35.121","scope": "192.168.35.121","user": "alice smith (alice)(+)","src_user_name": "alice smith (alice)(+)","src_machine_name": "xp1@opsec.com","snid": "b7e71f09","product": "Anti Malware","service": "http","s_port": "3370","device_version": "This is Check Points software version R77.10 - Build 243"}';

    let should_match = '{"protocolVersion":"1.0a","providerName":"Security Platform","eventTime":"2014-07-14T21:38:52.000Z","alertTime":"2016-04-18T00:02:16.464Z","dstUrl":"http://leiw6.ayid.vnz/za/images/threatwiki/pages/TestAntiBotBlade.html","dstDomain":"leiw6.ayid.vnz","deviceId":"192.168.115.177","deviceVersion":"This is Check Points software version R77.10 - Build 243","dstIp":"23.203.225.174","eventSeverity":"2","eventType":"URL reputation","eventDescription":"Communication with C&C site","eventHash":"{0x5318f19c,0x2,0xb17361d1,0xc0000000}","src":"192.168.35.121"}';

    let readable_stream = new Readable();
    readable_stream.push(data);
    readable_stream.push(null);
    let mapper = new ODNS_Mapper();

    streamToString(readable_stream.pipe(mapper), function(out_str) {
      var json = JSON.parse(out_str);
      expect(out_str).to.equal(should_match);
    });
  });

  it(`streamToString should convert stream to a string`, () => {
    let str = "A Test String";
    let readable_stream = new Readable();
    readable_stream.push(str);
    readable_stream.push(null);

    streamToString(readable_stream, function(out_str) {
      expect(out_str).to.equal(str);
    });
  });
});
