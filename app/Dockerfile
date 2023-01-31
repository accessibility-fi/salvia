#https://hub.docker.com/_/node
FROM node:16.19.0


WORKDIR /salvia-ui

COPY ./salvia-ui/package*.json ./

RUN npm install --unsafe-perm=true


WORKDIR /server

COPY ./server/package*.json ./

RUN npm install


COPY /server /server

COPY /salvia-ui /salvia-ui


#WORKDIR /salvia-ui
#RUN npm run build
#WORKDIR /server

EXPOSE 3000
EXPOSE 3001


CMD npm run start-dev
#CMD npm run start

