#!/bin/bash

npm run build
docker build -t="otherwhitefrank/cp_intake" .
docker push otherwhitefrank/cp_intake
