var Transform = require('stream').Transform;
var Readable = require('stream').Readable;
var Url = require('url');

import {fake_cp} from './fake_cp';

export function streamToString (stream, callback) {
  var str = '';
  stream.on('data', function(chunk) {
    str += chunk;
  });
  stream.on('end', function() {
    callback(str);
  });
}



//Check Point Parser
export class CP_Parser extends Transform {

  constructor(options) {
    super({
      readableObjectMode : true,
      writableObjectMode: true
    });
  }

  static _split_colon(entry) {
    let split_lines = entry.split(": ");
    let obj = {};

    let final_str = "";
    if (split_lines.length >= 2) {
      let key = split_lines[0].trim().toString();
      let value = split_lines[1].trim().toString();

      final_str +=  "\"" + key + "\": \"" + value + "\""
    }
    else {
      console.log("Error Spliting Entry on Colon: " + entry);
    }

    return final_str;
  };

  static _split_first_line(entry) {
    let split_lines = entry.split(" ");
    let obj = {};

    if (split_lines.length >= 11) {
      obj["event_creation"] = split_lines[0].trim().toString();
      obj["date2"] = split_lines[1].trim().toString();
      obj["date3"] = split_lines[2].trim().toString();
      obj["action_type"] = split_lines[3].trim().toString();
      obj["checkpoint_server_ip"] = split_lines[4].trim().toString();
      obj["device_desc"] = split_lines[5].trim().toString();
      obj["log_level"] = split_lines[6].trim().toString();

      let first_entry = split_lines.slice(7).join(" ").split(": ");
      obj[first_entry[0]] = first_entry[1];
    }
    else {
      console.log("Error Spliting Entry on Colon: " + entry);
    }

    let final_str = "";
    for (var key in obj) {
      final_str +=  "\"" + key + "\": \"" + obj[key] + "\","
    }

    final_str = final_str.substring(0, final_str.length - 1);

    return final_str;
  };

  _transform = function(chunk, encoding, done) {
    var data = chunk.toString();
    if (!this._lastData) {
      this.push('{');
    } else {
      data = this._lastData + data;
    }

    var lines = data.split(';');
    this._lastData = lines.splice(lines.length-1,1)[0]; //Set lastData to last entry to catch partial data

    (function(stream) {
      lines.forEach(function(element, index, array) {
        if (index === 0) {
          lines[index] = CP_Parser._split_first_line(lines[index]);
        }
        else {
          lines[index] = CP_Parser._split_colon(element.trim());
        }

        if (index != lines.length-1) { //Skip , if last entry
          lines[index] = lines[index] + ',';
        }

        stream.push(lines[index]);
      });
    })(this);

    done();
  };

  _flush = function(done) {
    if (this._lastData)
      this.push(this._lastData);

    this.push('}');

    this._lastData = null;

    done();
  };
}

//Check Point Parser
export class DNS_Mapper extends Transform {
  constructor(options) {
    super({
      readableObjectMode : true,
      writableObjectMode: true
    });
  }

  _transform = function(chunk, encoding, done) {
    if (!this._allData) {
      this._allData = "";
    }

    var data = chunk.toString();
    this._allData += data;

    done();
  };

  _flush = function(done) {
    let final_obj = {};

    //Map from Check Point keys to OpenDNS S-platform keys
    var OPENDNS_MAPPING = {
      "checkpoint_server_ip":"deviceId",
      "device_version":"deviceVersion",
      "dst":"dstIp",
      "severity":"eventSeverity",
      "Protection Type":"eventType",
      "malware_action":"eventDescription",
      "session_id":"eventHash",
      "src":"src"
    }

    //These always stay the same
    final_obj["protocolVersion"] = "1.0a";
    final_obj["providerName"] = "Security Platform";

    let parsed_json = JSON.parse(this._allData);

    //These require some special transformation
    if (parsed_json["event_creation"]) {
      let date_string = parsed_json["event_creation"];
      final_obj["eventTime"] = new Date(date_string).toISOString();
      final_obj["alertTime"] = new Date().toISOString();
    }

    if (parsed_json["resource"]) {
      let resource = parsed_json["resource"];
      let parsed_url = Url.parse(resource);
      final_obj["dstUrl"] = parsed_json["resource"];
      final_obj["dstDomain"] = parsed_url.hostname;
    }

    //These keys all directly map
    for (var key in OPENDNS_MAPPING) {
      if (parsed_json[key]) {
        final_obj[OPENDNS_MAPPING[key]] = parsed_json[key];
      }
    }

    this.push(JSON.stringify(final_obj));
    this._allData = null;

    done();
  };
}

//DEBUG
export function parse_cp(event) {
  var parser = new CP_Parser();
  var test = fake_cp();

  var s = new Readable;
  s.push(event);
  s.push(null);  //EOF

  return s.pipe(parser);
}
