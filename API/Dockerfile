FROM node:12

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies

COPY . .

RUN npm install

EXPOSE 80
CMD [ "node", "server.js" ]