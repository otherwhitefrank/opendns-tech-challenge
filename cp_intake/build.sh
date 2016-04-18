#!/bin/bash
npm install
npm run build
docker build -t="otherwhitefrank/cp_intake" .
