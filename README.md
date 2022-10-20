# Salvia

## Description
Salvia is a software for performing automatic web accessibility evaluations to websites and for printing reports on those evaluations. 

## Security
This source code and docker images are meant only as an example for the developers. The tool is licenced as open source and you can use the tool professionally and commercially. However, bear in mind that even though Salvia’s Docker containers can be run in multiple environments, the solution doesn’t contain many of the required security measures for usage in a public network. For instance, the API for the backend is open and therefore vulnerable for attacks if used without additional security measures. 

## Using Salvia
After starting Docker and the project containers (see below), you can access Salvia’s user interface in addresses:
http://localhost:3000 or http://localhost:3001

### Web accessibility evaluation
For evaluations, Salvia uses QualWeb testing engine and its ACT testing rules that match WCAG 2.1 level A and AA criteria. 
It’s important to remember that automatic testing can detect only some of the accessibility flaws. E.g., the tool can detect whether an image has a text alternative or not, but if finds an alternative text, the tool can’t evaluate whether the text is an appropriate description for the image. For that, a human expertise is needed, and the tool marks the finding as unclear.

#### Automatic testing
Automatic testing is the easiest and fastest way to test multiple pages on a web site. You can insert a site URL and let Salvia’s web crawler to fetch all the pages on the site and then choose which ones you want the tool to test. The amount of time, RAM and CPU resources the automatic evaluation requires depends on the number of pages and the content on the pages.
However automatic testing requires a direct ULR for each page and therefore Salvia can’t access pages that require login. And, as it uses URLs to identify a page, it can’t neither be used for evaluating single-page apps where all different views are shown under the same URL address.
#### Manual testing
Websites can be manually tested by testing each web page with a separate [QualWeb Chromium browser plugin] (https://chrome.google.com/webstore/detail/qualweb-extension/ljgilomdnehokancdcbkmbndkkiggioc) and uploading the test reports to Salvia. In Salvia all these single page test reports are joined as a one test report for the whole site.
Manual testing can therefore be used to evaluate websites that require a login and single-page apps as well as page views and DOM changes that are available only after user interactions

### Reporting
All performed tests are available on the archive page. From the archive page you can download there original QualWeb test reports in JSON format and more human-readable PDF versions. To keep the PDF reports in manageable length, only clear errors are listed in detail. 
In addition to the ACT’s three official test result types (passed, failed and inapplicable), QualWeb test reports include also a fourth result type: warning. In Salvia, instead of “warning” we use a term “unclear”. This refers to situations where a human a human expertise is required to make sure whether the accessibility requirement in question has been met.
As the QualWeb JSON report contains all the data and results about the test, it is also possible to download those placed in PDF documents. This is mainly for situations where one needs to store the reports to a system that accepts PDFs only. 

### Localisation
Currently Salvia supports English, Finnish and Swedish. 
More languages can be added by adding your own localisation files. However, the translations of the ACT tests and their results are a part of the QualWeb tool. So for the full language support you need to provide translations for the QualWeb project too (https://github.com/qualweb/locale).

### Accessibility
Based on our evaluations, Salvia’s UI should be accessible. If you find any flaws or have suggestions for improvement, you can an add an issue in GitHub.
The test report PDFs still have a couple shortcomings though. These are described on the accessibility statements. The requirement for accessibility statements comes from [the European Union’s Web Accessibility Directive’s](https://eur-lex.europa.eu/legal-content/FI/TXT/?uri=CELEX%3A32016L2102) and it’s model from [the European Commission’s Implementing Decision (EU) 2018/1523](https://eur-lex.europa.eu/eli/dec_impl/2018/1523/oj). If you’re going take Salvia into use, please update the Accessibility Statements to refer the proper service provider and supervisory authority.

## Building Docker images and starting the containers and services

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

### Building the service from docker containers
#### System requirements
Before starting the containers, you should adjust the RAM and CPU resources allocated for your Docker. If docker lacks enough memory, it might cause errors in starting the containers or running services in them. One should probably reserve at least 8 GB of RAM for Docker.

### Docker-compose

#### Using prebuilt Docker images from [GitHub Packages container registry](https://github.com/orgs/accessibility-fi/packages?repo_name=salvia)

```console
cd /dir_where_the_repo_is_located/
docker-compose up  -d --force-recreate --build --remove-orphans
```

#### Building local images from this repo and running it, we add build context with the additional file.
You can rerun this command if you modify files and benefit greatly from docker cache.
```console
cd /dir_where_the_repo_is_located/
docker-compose -f docker-compose.yml -f docker-compose.build.yml up  -d --force-recreate --build --remove-orphans
```
#### Stopping the project
If you want to stop the containers but keep the previously saved report data you can stop the containers with command
```console
cd /dir_where_the_repo_is_located/docker-compose down
```
#### Stop and remove the containers, remove network, volumes and local images
Run without parameters to only stop and remove the containers and remove network.
```console
cd /dir_where_the_repo_is_located/docker-compose down -v --rmi local
```
### Removing all docker assets for a clean slate.
Disclaimer: this will clean also containers, networks, images and cache not related to this project.
```console
docker system prune -a
docker volume prune
```
More instructions available at https://docs.docker.com/reference/

### Networking
Running locally, containers can connect to each other with their names that are defined in [docker-compose.yml](./docker-compose.yml), for example to connect to SQL Server: "mssql:1433".
Or if you need to connect from Docker host machine into container, you can use localhost, for example to connect to SQL Server: "localhost:1433".
For enabling https in api, you would need to create your own certificate and mount it: https://github.com/dotnet/dotnet-docker/blob/main/samples/host-aspnetcore-https.md

### Configuration
All configuration that can be changed is defined in the [docker-compose.yml](./docker-compose.yml)-file as enviroment variables.

### Debugging
#### Some common Docker commands for debugging.
```console
docker exec -it salvia_app /bin/bash
docker logs -f salvia_app
docker inspect salvia_app
docker restart salvia_app
```

### Licensing
See [LICENSE](./LICENSE.md)

### Third party software is used as dependencies, that is mostly MIT licensed, here is a some of the most used ones:
* [Qualweb Crawler](https://github.com/qualweb/crawler/)
* [Qualweb Core](https://github.com/qualweb/core/)
* [Node Fetch](https://github.com/node-fetch/node-fetch/)
* [Puppeteer](https://github.com/puppeteer/puppeteer) Apache License 2.0
* [React](https://github.com/facebook/react)
* [Bootstrap](https://github.com/twbs/bootstrap)
* [FontAwesome](https://github.com/FortAwesome/Font-Awesome)
* [i18next](https://github.com/i18next/i18next)
* [pdfkit](https://github.com/foliojs/pdfkit)

Exception to this is [Microsoft SQL Server](https://hub.docker.com/_/microsoft-mssql-server), which requires that you already have a valid license and you state that in the enviroment variables found in [docker-compose.yml](./docker-compose.yml)-file.


### Contributing changes
* See [CONTRIBUTING.md](docs/CONTRIBUTING.md)

### Additional documents in /docs
* [CODE_OF_CONDUCT](docs/CODE_OF_CONDUCT.md)
* [SECURITY](docs/SECURITY.md)
* [SUPPORT](docs/SUPPORT.md)

### Troubleshooting
If you get the following error for example, as an example you can run this command:
```
docker -v
```

