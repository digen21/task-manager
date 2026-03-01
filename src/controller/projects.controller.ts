import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { AppDataSource as dataSource } from "@config";
import { Project, ProjectMember, User } from "@entity";
import { projectService, userService } from "@services";
import { UserRoles } from "@types";
import { catchAsync, ServerError } from "@utils";

export const createProject = catchAsync(async (req: Request, res: Response) => {
  const { name } = req.body;
  const { organizationId, id } = req.user as User;

  const result = await dataSource.transaction(async (txn) => {
    const createdProject = await txn.save(Project, {
      name,
      organizationId,
    });

    const createProjectMember = await txn.save(ProjectMember, {
      projectId: createdProject.id,
      userId: id,
      role: UserRoles.ADMIN,
    });

    return {
      project: createdProject,
      projectMember: createProjectMember,
    };
  });

  return res.status(httpStatus.CREATED).json({
    data: result,
    status: httpStatus.CREATED,
  });
});

export const createProjectMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { memberId, projectId, role } = req.body;
    const { organizationId } = req.user as User;

    const existsProject = await projectService.get({
      organizationId: organizationId,
      id: projectId,
    });

    if (!existsProject) {
      return next(
        new ServerError({
          message: `Project does not found with organization ${organizationId} & project ${projectId}`,
          status: httpStatus.NOT_FOUND,
        }),
      );
    }

    const user = await userService.get({
      id: memberId,
      organizationId,
    });

    if (!user)
      throw new ServerError({
        message: `Member ${memberId} does not belong to organization ${organizationId}`,
        status: httpStatus.NOT_FOUND,
      });

    // project member already exists
    const isExists = await projectService.getProjectMember({
      projectId,
      userId: memberId,
    });

    if (isExists)
      return next(
        new ServerError({
          message: "Member already exists",
          status: httpStatus.CONFLICT,
        }),
      );

    const createdMember = await projectService.createProjectMember({
      projectId,
      userId: memberId,
      role: role ?? UserRoles.MEMBER,
    });

    return res.status(httpStatus.CREATED).json({
      data: createdMember,
      status: httpStatus.CREATED,
    });
  },
);

export const getProjects = catchAsync(async (req: Request, res: Response) => {
  const { organizationId, role, id } = req.user as User;
  const result = dataSource
    .getRepository(Project)
    .createQueryBuilder("p")
    .select(["p.id", "p.name", "p.createdAt"])
    .where("p.organization = :organizationId", { organizationId });

  // send current user project if not a admin user
  if (role === UserRoles.MEMBER) {
    result.innerJoin(
      ProjectMember,
      "pm",
      "pm.project = p.id AND pm.user = :userId",
      { userId: id },
    );
  }

  const projects = await result.orderBy("p.created_at", "DESC").getMany();

  return res.status(httpStatus.OK).json({
    data: projects,
    status: httpStatus.OK,
  });
});

export const getProjectMembers = catchAsync(
  async (req: Request, res: Response) => {
    const { projectId } = req.params as { projectId: string };
    const { id } = req.user as User;

    const members = await dataSource
      .getRepository(ProjectMember)
      .createQueryBuilder("pm")
      .innerJoin(
        ProjectMember,
        "me",
        "me.project = pm.project AND me.user = :userId",
        { userId: id },
      )
      .leftJoin("pm.user", "user")
      .select(["pm.id", "pm.role", "user.id", "user.email"])
      .where("pm.project = :projectId", { projectId })
      .getMany();

    return res.status(httpStatus.OK).json({
      data: members,
      status: httpStatus.OK,
    });
  },
);
