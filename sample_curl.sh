#!/bin/bash
curl 'https://s-platform.api.opendns.com/1.0/events?customerKey=ca9c0847-0e85-41f2-ba6a-937c66789827' \
-v -X POST \
-H 'Content-Type: application/json' \
-d '{"protocolVersion":"1.0a","providerName":"Security Platform","eventTime":"2014-07-14T21:38:52.000Z","alertTime":"2016-04-17T07:00:38.981Z","dstUrl":"https://gladyce.biz","dstDomain":"gladyce.biz","deviceId":"94.253.233.68","deviceVersion":"This is Check Points software version R77.10 - Build 243","dstIp":"74.140.57.137","eventSeverity":"0","eventType":"URL reputation","eventDescription":"Communication with C&C site","eventHash":"[0xefba3468,0x9,0xaaeb14a8,0x5157aee8]","src":"228.122.36.206"}'
