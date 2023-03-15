FROM node:16.14.2-alpine

WORKDIR /usr/src/app

COPY ./package*.json ./

RUN --mount=type=secret,id=MONGODB_PASSWORD \
    --mount=type=secret,id=MONGODB_USERNAME \
    export MONGODB_PASSWORD=$(cat /run/secrets/MONGODB_PASSWORD) && \
    export MONGODB_USERNAME=$(cat /run/secrets/MONGODB_USERNAME) && \
    echo "MONGODB_PASSWORD=$MONGODB_PASSWORD" >> .env && \
    echo "MONGODB_USERNAME=$MONGODB_USERNAME" >> .env

RUN yarn set version 1.22.19

RUN yarn

COPY . .

EXPOSE 3333

CMD ["yarn", "build"]
