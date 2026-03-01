import express, { Express } from "express";

import { isAuth, rateLimiter } from "@middlewares";
import authRouter from "./auth.routes";
import projectRouter from "./project.routes";
import taskActivityRouter from "./task-activity.routes";
import taskRouter from "./task.routes";
import userRouter from "./user.routes";

const useRoutes = (app: Express) => {
  const router = express.Router();

  router.use("/auth", authRouter);
  router.use("/user", rateLimiter, isAuth, userRouter);
  router.use("/projects", rateLimiter, isAuth, projectRouter);
  router.use("/tasks", rateLimiter, isAuth, taskRouter);
  router.use("/task-activity", rateLimiter, isAuth, taskActivityRouter);

  app.use("/api", router);
};

export default useRoutes;
