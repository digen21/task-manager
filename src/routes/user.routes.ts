import express from "express";

import { createMember } from "@controller";
import { isAdminRole, validate } from "@middlewares";
import { createMemberSchema } from "@validators";

const userRouter = express.Router();

userRouter.post(
  "/member",
  isAdminRole,
  validate(createMemberSchema),
  createMember,
);

export default userRouter;
