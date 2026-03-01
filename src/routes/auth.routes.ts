import express from "express";

import { login, profile, register } from "@controller";
import { authLimiter, isAuth, validate } from "@middlewares";
import { loginValidationSchema, registerValidationSchema } from "@validators";

const authRouter = express.Router();

authRouter.post("/login", authLimiter, validate(loginValidationSchema), login);
authRouter.post(
  "/register",
  authLimiter,
  validate(registerValidationSchema),
  register,
);
authRouter.get("/profile", isAuth, profile);

export default authRouter;
