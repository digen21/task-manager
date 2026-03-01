import Joi from "joi";

import { UserRoles } from "@types";

export const createMemberSchema = Joi.object({
  body: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(16).required(),
    role: Joi.string().valid(UserRoles).optional().default(UserRoles.MEMBER),
  }),
});
