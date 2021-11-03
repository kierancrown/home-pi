FROM node:16 as base

WORKDIR /home/node/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN yarn build