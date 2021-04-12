FROM node:12

WORKDIR /client

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./packages/client ./packages/client
COPY ./packages/shared ./packages/shared

RUN yarn && yarn install && cd packages/client && npm i colyseus.js

CMD ["npm", "run", "prod:client"]