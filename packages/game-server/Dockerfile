FROM node:12

ARG TCP_PORT
ARG UDP_PORT

WORKDIR /game-server

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./packages/game-server ./packages/game-server
COPY ./packages/shared ./packages/shared

EXPOSE ${TCP_PORT}
EXPOSE ${UDP_PORT}

RUN yarn && yarn install

CMD ["npm", "run", "prod:game-server"]