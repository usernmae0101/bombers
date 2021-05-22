FROM node:12

ARG PORT 

WORKDIR /app-server

COPY ./package.json ./
COPY ./yarn.lock ./
COPY ./packages/app-server ./packages/app-server
COPY ./packages/shared ./packages/shared

EXPOSE ${PORT}

RUN yarn && yarn install

CMD ["npm", "run", "prod:app-server"]