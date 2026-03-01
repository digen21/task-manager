import "dotenv/config";

import { envValidatorSchema } from "@validators";

const { error, value } = envValidatorSchema.validate(process.env);

if (error) throw new Error(`missing env variable ${error.message}`);

const env = {
  PORT: value.PORT,
  NODE_ENV: value.NODE_ENV,
  DATABASE_HOST: value.DATABASE_HOST,
  DATABASE_PORT: value.DATABASE_PORT,
  DATABASE_USERNAME: value.DATABASE_USERNAME,
  DATABASE_PASSWORD: value.DATABASE_PASSWORD,
  DATABASE: value.DATABASE,
  JWT_SECRET: value.JWT_SECRET,
  EXPIRY_TIME: "5d",
  IS_DEV: value.NODE_ENV === "development",
};

export default env;
