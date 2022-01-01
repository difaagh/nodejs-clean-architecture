# Overview

this NodeJS project use typescript, typeorm, and postgres database

support transactional, and auto rollback for testing with database

## Get started

1. Download nodejs v14++
2. Postgres database (you can choose the database you want. see [this](https://github.com/typeorm/typeorm#installation) for supported database )


## Cloning project

```shell
git clone https://github.com/difaagh/nodejs-clean-architecture.git
```

## Download Dependencies

```shell
cd nodejs-clean-architecture

npm install
```
notes: if choose to not use postgres you need to install the driver for the database that you choose. see [this](https://github.com/typeorm/typeorm#installation)

## Run postgres

```shell
# Run postgres with all the default config
```


## Update env

```shell
mv .env_example_for_development .env
# Update .env values manually
# if you choose to not use postgres then change the TYPEORM_TYPE="postgres" to TYPEORM_TYPE="{database you choose}"
```

## Test the project
```
cd nodejs-clean-architecture

npm run test
```

## Start a project

```shell
cd nodejs-clean-architecture

npm run build && npm run start
```

