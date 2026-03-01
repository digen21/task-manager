import express from "express";

import {
  createTask,
  deleteTask,
  getTaskInfo,
  getTasks,
  updateTask,
} from "@controller";
import { allowedRoles, validate } from "@middlewares";
import { UserRoles } from "@types";
import {
  createTaskSchema,
  getIdParamsSchema,
  getTasksSchema,
  updateTaskSchema,
} from "@validators";

const taskRouter = express.Router();

taskRouter.post(
  "/",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(createTaskSchema),
  createTask,
);

taskRouter.get(
  "/:id",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(getIdParamsSchema),
  getTaskInfo,
);

taskRouter.patch(
  "/:id",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(updateTaskSchema),
  updateTask,
);

taskRouter.get(
  "/",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(getTasksSchema),
  getTasks,
);

taskRouter.delete(
  "/:id",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(getIdParamsSchema),
  deleteTask,
);

export default taskRouter;
