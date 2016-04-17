#!/bin/bash
curl 'https://s-platform.api.opendns.com/1.0/events?customerKey=ca9c0847-0e85-41f2-ba6a-937c66789827' \
-v -X POST \
-H 'Content-Type: application/json' \
-d '{"protocolVersion":"1.0a","providerName":"Security Platform","eventTime":"2014-07-14T21:38:52.000Z","alertTime":"2016-04-17T18:32:32.109Z","dstUrl":"http://pascale.org","dstDomain":"pascale.org","deviceId":"57.31.13.97","deviceVersion":"This is Check Points software version R77.10 - Build 243","dstIp":"145.2.187.2","eventSeverity":"3","eventType":"URL reputation","eventDescription":"Communication with C&C site","eventHash":"[0xb86169a3,0xb,0xf5cb51aa,0xe1517df6]","src":"12.206.114.168"}'
