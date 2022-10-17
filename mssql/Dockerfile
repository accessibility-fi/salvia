# https://hub.docker.com/_/microsoft-mssql-server
FROM mcr.microsoft.com/mssql/server:2019-CU16-ubuntu-20.04

WORKDIR /usr/src

# Copy files over
COPY . /usr/src

ENTRYPOINT /bin/bash ./entrypoint.sh

