# https://hub.docker.com/_/microsoft-azure-functions-node
FROM mcr.microsoft.com/azure-functions/node:4-node18-core-tools

RUN apt update && \
apt install -y libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev libasound2

ENV AzureWebJobsScriptRoot=/home/site/wwwroot \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

ENV FUNCTIONS_WORKER_RUNTIME=node

WORKDIR /app

COPY ./src/package*.json ./

RUN npm install --unsafe-perm=true

#RUN npm run build --if-present
#RUN npm prune --production

COPY /src /app

EXPOSE 7071

CMD [ "npm", "start" ]