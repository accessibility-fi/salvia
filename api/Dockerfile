# Enabling HTTPS: https://github.com/dotnet/dotnet-docker/blob/main/samples/host-aspnetcore-https.md

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
COPY /vsproject /src
WORKDIR "/src"
RUN dotnet restore "SalviaServiceAPI.csproj"
RUN dotnet build "SalviaServiceAPI.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SalviaServiceAPI.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "guid.dll"]

