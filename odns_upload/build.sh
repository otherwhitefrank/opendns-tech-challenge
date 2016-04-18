#!/bin/bash
npm install
npm run build
docker build -t="otherwhitefrank/odns_upload" .
