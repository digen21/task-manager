import Joi from "joi";
import { TaskStatus } from "@types";

export const createTaskSchema = Joi.object({
  body: Joi.object({
    title: Joi.string().required(),
    projectId: Joi.string().required(),
    assigneeId: Joi.string().optional(),
    dueDate: Joi.date().required(),
  }),
});

export const getIdParamsSchema = Joi.object({
  params: Joi.object({
    id: Joi.string().required(),
  }),
});

export const getTaskAnalyticsSchema = Joi.object({
  query: Joi.object({
    projectId: Joi.string().required(),
    from: Joi.date().iso().required(),
    to: Joi.date().iso().required(),
  }),
});

export const getTaskIdParamsSchema = Joi.object({
  params: Joi.object({
    taskId: Joi.string().required(),
  }),
});

export const getTasksSchema = Joi.object({
  query: Joi.object({
    projectId: Joi.string().required(),
    page: Joi.number().default(1),
    limit: Joi.number().default(10),
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
    dueDate: Joi.date().optional(),
    completedAt: Joi.date().optional(),
  }),
});
