FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY ["Momentum.Api/Momentum.Api.csproj", "Momentum.Api/"]

RUN dotnet restore "Momentum.Api/Momentum.Api.csproj"

COPY . .

WORKDIR "/src/Momentum.Api"

RUN dotnet build "Momentum.Api.csproj" -c Release -o /app/build

FROM build AS publish

RUN dotnet publish "Momentum.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final

WORKDIR /app

COPY --from=publish /app/publish .

ENTRYPOINT ["dotnet", "Momentum.Api.dll"]