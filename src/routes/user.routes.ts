import express from "express";

import { createMember, getMembers } from "@controller";
import { isAdminRole, validate } from "@middlewares";
import { createMemberSchema } from "@validators";

const userRouter = express.Router();

userRouter.post(
  "/member",
  isAdminRole,
  validate(createMemberSchema),
  createMember,
);

userRouter.get("/members", isAdminRole, getMembers);

export default userRouter;
