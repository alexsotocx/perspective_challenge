FROM node:18-alpine AS builder

WORKDIR /home/application/app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lock-file

COPY . .

RUN yarn build

RUN yarn install --prod --offline


FROM node:18-alpine

WORKDIR /home/application/app

RUN adduser --disabled-password application && \
  chown -R application:application /home/application

COPY --from=builder --chown=application:application  /home/application/app/ ./

USER application

ARG VERSION
ENV NODE_ENV production
ENV VERSION ${VERSION}

EXPOSE 8000

CMD yarn start:api
