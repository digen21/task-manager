import express from "express";

import {
  createProject,
  createProjectMember,
  getProjectMembers,
  getProjects,
} from "@controller";
import { allowedRoles, isAdminRole, validate } from "@middlewares";
import { UserRoles } from "@types";
import {
  createProjectMemberSchema,
  createProjectSchema,
  getProjectMemberSchema,
} from "@validators";

const projectRouter = express.Router();

projectRouter.post(
  "/",
  isAdminRole,
  validate(createProjectSchema),
  createProject,
);

projectRouter.post(
  "/project-members",
  isAdminRole,
  validate(createProjectMemberSchema),
  createProjectMember,
);

projectRouter.get(
  "/",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  getProjects,
);
projectRouter.get(
  "/project-members/:projectId",
  allowedRoles([UserRoles.ADMIN, UserRoles.MEMBER]),
  validate(getProjectMemberSchema),
  getProjectMembers,
);

export default projectRouter;
