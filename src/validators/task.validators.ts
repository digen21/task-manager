import Joi from "joi";
import { TaskStatus } from "@types";

export const createTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    projectId: Joi.string().required(),
    assigneeId: Joi.string().optional(),
  }),
});

export const getIdParamsSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

export const getTasksSchema = Joi.object({
  query: Joi.object({
    projectId: Joi.string().required(),
  }),
});

export const updateTaskSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
  body: Joi.object({
    title: Joi.string().optional(),
    status: Joi.string()
      .valid(...Object.values(TaskStatus))
      .optional(),
    assigneeId: Joi.string().optional(),
  }).or("title", "status", "assigneeId"),
});
