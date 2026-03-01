import { UserRoles } from "@types";
import Joi from "joi";

export const createProjectSchema = Joi.object({
  body: Joi.object({
    name: Joi.string().required(),
  }),
});

export const createProjectMemberSchema = Joi.object({
  body: Joi.object({
    memberId: Joi.string().required(),
    projectId: Joi.string().required(),
    role: Joi.string().valid(UserRoles).default(UserRoles.MEMBER),
  }),
});

export const getProjectMemberSchema = Joi.object({
  params: Joi.object({
    projectId: Joi.string().required(),
  }),
  query: Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
  }),
});

export const getProjectsSchema = Joi.object({
  query: Joi.object({
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
  }),
});
