import express, { Express } from "express";

import { isAuth } from "@middlewares";
import authRouter from "./auth.routes";
import projectRouter from "./project.routes";
import taskRouter from "./task.routes";
import userRouter from "./user.routes";

const useRoutes = (app: Express) => {
  const router = express.Router();

  router.use("/auth", authRouter);
  router.use("/user", isAuth, userRouter);
  router.use("/projects", isAuth, projectRouter);
  router.use("/tasks", isAuth, taskRouter);

  app.use("/api", router);
};

export default useRoutes;
