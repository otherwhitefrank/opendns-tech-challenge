#ODNS_Upload microservice to read a json packet from RabbitMQ and forward to OpenDNS S-Platform
FROM node:latest

COPY ./lib /api
COPY ./package.json /api/package.json

WORKDIR /api

RUN npm install

CMD ["npm","start"]
