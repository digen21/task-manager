import express from "express";

import { getTaskActivity, getTaskAnalytics } from "@controller";
import { allowedRoles, rateLimiter, validate } from "@middlewares";
import { UserRoles } from "@types";
import { getTaskIdParamsSchema, getTaskAnalyticsSchema } from "@validators";

const taskActivityRouter = express.Router();

taskActivityRouter.get(
  "/:taskId",
  rateLimiter,
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(getTaskIdParamsSchema),
  getTaskActivity,
);

taskActivityRouter.get(
  "/",
  rateLimiter,
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(getTaskAnalyticsSchema),
  getTaskAnalytics,
);

export default taskActivityRouter;
