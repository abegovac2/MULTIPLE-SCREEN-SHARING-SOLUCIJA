FROM node:alpine
COPY . ./backend
WORKDIR /backend
RUN [ "npm", "install", "--legacy-peer-deps" ]
CMD [ "npm", "start" ]
