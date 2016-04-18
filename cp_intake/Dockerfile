#CP_Intake microservice to read a Check Point event, transform it into S-Platform API Json,
# then forward to RabbitMQ for consumption
FROM node:latest

COPY ./lib /api
COPY ./package.json /api/package.json

WORKDIR /api

RUN npm install

CMD ["npm","start"]
