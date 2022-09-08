FROM node:alpine
COPY . ./frontend
WORKDIR /frontend
RUN [ "npm", "install", "--legacy-peer-deps" ]
RUN [ "npm", "i", "-g", "serve"]
ENV REACT_APP_API_LINK=http://localhost:8080
RUN [ "npm", "run", "build" ]
CMD ["serve", "-s", "build"]
#CMD [ "npm", "start" ]