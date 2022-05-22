FROM node:alpine
COPY . ./frontend
WORKDIR /frontend
RUN [ "npm", "install", "--legacy-peer-deps" ]
CMD [ "npm", "start" ]