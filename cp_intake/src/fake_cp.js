'use strict';

var faker = require('faker');
var logger = require('winston'); //Acquires default logger configured in index.js

function fake_proto() {
  let arr = [
    'tcp','udp','tsl'
  ];

  return faker.random.arrayElement(arr);
}

function fake_os() {
  let arr = [
    'Windows','Mac','Linux','Unix'
  ];

  return faker.random.arrayElement(arr);
}

var randomPlaceholders = function (placeholder) {
  let random = faker.random.number({ min: 0, max: 15 });
  let value = placeholder == 'T' ? random : (random &0x3 | 0x8);
  return value.toString(16);
};

function fake_malware_rule_id() {
  let malware_template = 'TTTTTTTT-TTTT-TTTT-TTTT-TTTTTTTTTTTT';
  return malware_template.replace(/[T]/g, randomPlaceholders);
}

function fake_session_id() {
  let session_template = '0xTTTTTTTT,0xT,0xTTTTTTTT,0xTTTTTTTT';
  return session_template.replace(/[T]/g, randomPlaceholders);
}

function fake_snid() {
  let snid_template = 'TTTTTTTT';
  return snid_template.replace(/[T]/g, randomPlaceholders);
}

function fake_user_name() {
  let first_name = faker.name.firstName().toLowerCase();
  let last_name = faker.name.lastName().toLowerCase();
  return first_name + ' ' + last_name + '(' + first_name + ')(+)';
}

export function fake_cp() {
  var dummy_event =
    [
      '2014-07-14T21:38:52+0000 6Mar2014 14:07:24 redirect ' + faker.internet.ip() + ' <eth1 alert web_client_type: Microsoft IE 8.0;',
      'resource: ' + faker.internet.url() + ';',
      'src: ' + faker.internet.ip() + ';',
      'dst: ' + faker.internet.ip() + ';',
      'proto: ' + fake_proto() + ';',
      'session_id: [' + fake_session_id() + '];',
      'Protection name: Check Point - Testing Bot;',
      'malware_family: Check Point;',
      'Source OS: ' + fake_os() + ';',
      'Confidence Level: ' + faker.random.number({ min: 0, max: 5}) + ';',
      'severity: ' + faker.random.number({ min: 0, max: 5}) + ';',
      'malware_action: Communication with C&C site;',
      'rule_uid: {' + faker.random.uuid() + '};',
      'Protection Type: URL reputation;',
      'malware_rule_id: {' + fake_malware_rule_id() + '};',
      'protection_id: 00233CFEE;',
      'refid: ' + faker.random.number({ min: 0, max: 5}) + ';',
      'log_id: ' + faker.random.number({ min: 0, max: 5}) + ';',
      'proxy_src_ip: ' + faker.internet.ip() + ';',
      'scope: ' + faker.internet.ip() + ';',
      'user: ' + fake_user_name() + ';',
      'src_user_name: ' + fake_user_name() + ';',
      'src_machine_name: ' + faker.internet.email() + ';',
      'snid: ' + fake_snid() + ';',
      'product: Anti Malware;',
      'service: ' + faker.internet.protocol() + ';',
      's_port: ' + faker.random.number({ min: 22, max: 8080}) + ';',
      'device_version: This is Check Points software version R77.10 - Build 243;'
    ];

  return dummy_event.join(' ');
}
