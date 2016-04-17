export util from './util';

"use strict";

import { parse_cp } from './util';
import { fake_cp } from './fake_cp';
import { CP_Parser } from './util';
import { DNS_Mapper } from './util';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
//app.use(bodyParser());

app.post('/checkpoint', function (req, res) {
  var parser = new CP_Parser();
  var dns_mapper = new DNS_Mapper();

  req.pipe(parser).pipe(dns_mapper).pipe(res);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
