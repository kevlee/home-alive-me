FROM node:current-alpine3.12 as build-stage
WORKDIR /home-alive-me
COPY package*.json ./
RUN npm install
COPY ./ .
RUN npm run build

FROM nginx:stable-alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /home-alive-me/dist /app
COPY nginx.conf /etc/nginx/nginx.conf