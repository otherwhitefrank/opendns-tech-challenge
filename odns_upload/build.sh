#!/bin/bash

npm run build
docker build -t="otherwhitefrank/odns_upload" .
docker push otherwhitefrank/odns_upload
