# Project Guide

## Setup ENV

- In the root folder, the file `.env.example` file is exists
- copy `.env.example` file and rename the file name to `.env`.
- Need to pass all the mentioned values inside the `.env` file, otherwise the `envVariable.ts` will throw error missing env variables

## Setup Database

- Before start project it is mandatory to setup the database
- Run below command to run the `setupdb.js` file
- This file handled creating database

```shell

$ npm run setup:db

```

## Typeorm

- _*Mainly used to generate the maintaining models (table) & easy to generate the migration by making directly changes in the entity file*_

- In the `src/config/dataSource.ts` file managed typeorm configuration
  - In that I have gave path of dist file that is `.js` file, in order to avoid type module error
  - `%npm_config_name%` flag is used to pass the file name from command line (Windows specific `%___%`)

- To Run existing migration from the `src/migration`

```shell

 $ npm run migration:run

```

- To generate migrations from the entities

```shell

 $ npm run migration:generate --name=<migration_name>

```

NOTE (Migration will be apply only after running `npm run migration:run` after running generate command)

- To revert migrations from

```shell

 $ npm run migration:revert

```

- To create or write custom migrations

```shell

 $ npm run migration:create --name=<migration_name>

```

---

## Start Project

- To run project in development

```shell

 $ npm run dev

```

- To build project
- `tsc-alias`: Replace alias paths with relative paths after typescript compilation (mainly used for short import)

```shell

 $ npm run build

```

- To Run in production

```shell

 $ npm run start

```

## Architecture overview

- Tech Stack
  - Runtime: Node.js with TypeScript
  - Framework: Express.js
  - ORM: TypeORM with MySQL
  - Auth: Passport.js with JWT strategy
  - Validation: Joi
  - Logging: Winston

- Modules
  - Auth
  - User
  - Projects
  - Tasks
  - ActivityLog
  - Project Members

- Key Middlewares
  - isAuth – JWT authentication via Passport
  - allowedRoles – Role-based access control
  - rateLimiter – Request throttling
  - validate – Request validation with Joi
  - errorHandler – Global error handling (`Database Errors`, `ServerError`)
  - requestLogger – Request logging (`API Request Logging`)

## Scaling approach & Performance strategy

- Read Replicas - Separate read/write operations tp increase read potation faster (Mostly for analysts)

- Query caching - Implement Redis Or any memory cache for frequent db queries

- Connection Pool - Can configure max connection pools so that database can handle more requests

- API Optimizations:
  - response compression
  - cursor based pagination

- Monitoring:
  - Motoring the system usage
  - Slow query/api response check

- Adding Resources

## Security Considerations

- JWT authentication with bcrypt password hashing
- Rate limiting (100 req/15min general, 10 req/15min auth)
- Helmet for HTTP headers
- CORS enabled
- Input validation with Joi
- Password exclusion from responses
- Environment variable validation
