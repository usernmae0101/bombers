FROM node:12

ARG PORT

WORKDIR /server

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./packages/server ./packages/server
COPY ./packages/shared ./packages/shared

EXPOSE ${PORT}

RUN yarn && yarn install

CMD ["npm", "run", "prod:server"]