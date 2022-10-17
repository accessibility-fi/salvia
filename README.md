# Salvia

## Description

#### Explain the project etc here in a short summary style.

## Getting started

### Tools

The following tools are recommended for development:
* [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  * Tool to build docker images and run containers locally.
* [Visual studio](https://visualstudio.microsoft.com/)
  * Tool used to develop the API.
* [Postman](https://www.postman.com/)
  * Tool to make API calls and automate testing.
* [Azure Storage Explorer](https://azure.microsoft.com/en-us/features/storage-explorer/)
  * Tool to manage Azurite storage emulator.
* [SQL Server Management Studio](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms)
  * Tool to manage Microsoft SQL Server.

### Docker Compose

#### Using [prebuilt images from GitHub Packages container registry](https://github.com/orgs/accessibility-fi/packages?repo_name=salvia)
```console
cd /dir_where_the_repo_is_located/
docker-compose up  -d --force-recreate --build --remove-orphans
```

#### Building local images from this repo and running it, we add build context with the additional file.
#### You can rerun this command if you modify files and benefit greatly from docker cache.
```console
cd /dir_where_the_repo_is_located/
docker-compose -f docker-compose.yml -f docker-compose.build.yml up  -d --force-recreate --build --remove-orphans
```

## Networking
#### Running locally, containers can connect to each other with their names that are defined in [docker-compose.yml](./docker-compose.yml), for example to connect to SQL Server: "mssql:1433".
#### Or if you need to connect from Docker host machine into container, you can use localhost, for example to connect to SQL Server: "localhost:1433".
#### For enabling https in api, you would need to create your own certificate and mount it: https://github.com/dotnet/dotnet-docker/blob/main/samples/host-aspnetcore-https.md

## Configuration
#### All configuration that can be changed is defined in the [docker-compose.yml](./docker-compose.yml)-file as enviroment variables.

## Debugging
#### Some common Docker commands for debugging.
```console
docker exec -it salvia_app /bin/bash
docker logs -f salvia_app
docker inspect salvia_app
docker restart salvia_app
```

## Removing and cleaning project
### Stop and remove the containers, remove network, volumes and local images
#### Run without parameters to only stop and remove the containers and remove network.
```console
cd /dir_where_the_repo_is_located/
docker compose down -v --rmi local
```

### Removing all docker assets for a clean slate.
#### Disclaimer: this will clean also containers, networks, images and cache not related to this project.
```console
docker system prune -a
docker volume prune
```


## Licensing

#### See [LICENSE](./LICENSE.md)

#### Third party software is used as dependencies, that is mostly MIT licensed, here is a some of the most used ones:
* [Qualweb Crawler](https://github.com/qualweb/crawler/)
* [Qualweb Core](https://github.com/qualweb/core/)
* [Node Fetch](https://github.com/node-fetch/node-fetch/)
* [Puppeteer](https://github.com/puppeteer/puppeteer) Apache License 2.0
* [React](https://github.com/facebook/react)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [FontAwesome](https://github.com/FortAwesome/Font-Awesome)
* [i18next](https://github.com/i18next/i18next)
* [pdfkit](https://github.com/foliojs/pdfkit)

#### Exception to this is [Microsoft SQL Server](https://hub.docker.com/_/microsoft-mssql-server),
#### which requires that you already have a valid license and you state that in the enviroment variables found in [docker-compose.yml](./docker-compose.yml)-file.


## Contributing changes

* See [CONTRIBUTING.md](docs/CONTRIBUTING.md)

## Additional documents in /docs
* [CODE_OF_CONDUCT](docs/CODE_OF_CONDUCT.md)
* [SECURITY](docs/SECURITY.md)
* [SUPPORT](docs/SUPPORT.md)

## Troubleshooting

#### If you get the following error for example, as an example you can run this command:
```
docker -v
```

## Authors

* Firstname Lastname (firstname.lastname@email.com)

## Version history

* 0.2. Updated dependencies 19.07.2022 Firstname Lastname
* 0.1. First version for release 18.06.2022 Firstname Lastname

