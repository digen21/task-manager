import { DataSource } from "typeorm";

import { entities } from "@entity";
import { logger } from "@utils";
import env from "./envVariable";

const AppDataSource = new DataSource({
  type: "mysql",
  host: env.DATABASE_HOST,
  port: env.DATABASE_PORT,
  username: env.DATABASE_USERNAME,
  password: env.DATABASE_PASSWORD,
  database: env.DATABASE,
  synchronize: false,
  logging: false,
  migrationsTableName: "typeorm_migrations",
  entities: entities,
  migrations: ["dist/migrations/*{.ts,.js}"],
});

export const connectDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected.");
  } catch (error) {
    logger.error(`Error connecting database :: ${error?.message}`);
    throw error;
  }
};

export default AppDataSource;
