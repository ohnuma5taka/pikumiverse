FROM node:20 as node
WORKDIR /app
COPY ./*.json /app/
COPY ./yarn.lock /app/
COPY ./src /app/src/
ARG APP_MODE
ARG APP_VERSION
COPY ./src/environments/env.prod.ts ./src/environments/env.template.ts
RUN sed s/__APP_MODE__/${APP_MODE}/g ./src/environments/env.template.ts | sed s/__APP_VERSION__/${APP_VERSION}/g > /app/src/environments/env.prod.ts
RUN apt update && apt install gettext-base -y
RUN yarn install --network-timeout 1000000000
RUN yarn build

FROM nginx:stable
RUN apt-get update && apt-get install -y gettext-base vim
ADD ./nginx.conf /etc/nginx/conf.d/nginx.conf.template
ARG SERVER_NAME
ARG BACKEND_API_SERVER
RUN sed s/SERVER_NAME/${SERVER_NAME}/g /etc/nginx/conf.d/nginx.conf.template | sed s/BACKEND_API_SERVER/${BACKEND_API_SERVER}/g > /etc/nginx/conf.d/default.conf
RUN mkdir -p /usr/share/nginx/html
COPY --from=node /app/dist/out-tsc /usr/share/nginx/html
