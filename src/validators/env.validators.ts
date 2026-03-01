import Joi from "joi";

const envValidatorSchema = Joi.object({
  PORT: Joi.number().default(5000),
  NODE_ENV: Joi.string().required(),
  DATABASE_HOST: Joi.string().default("localhost").required(),
  DATABASE_PORT: Joi.number().default(3306).required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
}).unknown(true);

export default envValidatorSchema;
