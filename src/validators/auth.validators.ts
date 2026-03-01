import Joi from "joi";

import { UserRoles } from "@types";

export const registerValidationSchema = Joi.object({
  body: Joi.object({
    organizationName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
    role: Joi.string().valid(UserRoles).optional().default(UserRoles.ADMIN),
  }),
}).unknown(true);

export const loginValidationSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
  }),
}).unknown(true);
