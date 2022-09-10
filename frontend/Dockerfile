FROM node:alpine
COPY . ./frontend
WORKDIR /frontend
RUN [ "npm", "install", "--legacy-peer-deps" ]
RUN [ "npm", "i", "-g", "serve"]
RUN [ "npm", "run", "build" ]
CMD ["serve", "-s", "build"]
#CMD [ "npm", "start" ]