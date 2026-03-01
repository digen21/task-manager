import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { AppDataSource as dataSource } from "@config";
import { ActivityLogs, Task, User } from "@entity";
import { projectService } from "@services";
import { catchAsync, mapTask, ServerError } from "@utils";
import { IsNull } from "typeorm";

export const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, status, projectId, assigneeId } = req.body;
    const { id: userId, organizationId } = req.user as User;

    const project = await projectService.get({
      id: projectId,
      organizationId,
    });

    if (!project)
      return next(
        new ServerError({
          message: `Project not found for id ${projectId}`,
          status: httpStatus.NOT_FOUND,
        }),
      );

    const member = projectService.getProjectMember({
      projectId,
      userId: assigneeId ?? userId,
    });

    if (!member)
      return next(
        new ServerError({
          message: "Assignee not in project",
          status: httpStatus.BAD_REQUEST,
        }),
      );

    const result = await dataSource.transaction(async (txn) => {
      const task = await txn.getRepository(Task).save({
        title,
        status,
        projectId,
        assigneeId: assigneeId ?? userId,
      });

      await txn.getRepository(ActivityLogs).save({
        taskId: task.id,
        performedById: userId,
        action: "TASK_CREATED",
      });

      return task;
    });

    return res
      .status(httpStatus.CREATED)
      .json({ data: result, status: httpStatus.CREATED });
  },
);

export const getTaskInfo = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const task = await dataSource
    .getRepository(Task)
    .createQueryBuilder("task")
    .leftJoinAndSelect("task.project", "project")
    .leftJoinAndSelect("task.assignee", "assignee")
    .leftJoin(ActivityLogs, "al", "al.taskId = task.id")
    .leftJoin("al.performedBy", "creator")
    .select([
      "task.id",
      "task.title",
      "task.status",
      "task.version",
      "task.createdAt",
      "project.id",
      "project.name",
      "assignee.id",
      "assignee.email",
      "creator.id",
      "creator.email",
    ])
    .where("task.id = :id", { id })
    .andWhere("task.deletedAt IS NULL")
    .getRawOne();

  if (!task) {
    return res.status(httpStatus.NOT_FOUND).send({
      data: null,
      status: httpStatus.NOT_FOUND,
    });
  }

  return res.status(httpStatus.OK).send({
    data: mapTask(task),
    status: httpStatus.OK,
  });
});

export const getTasks = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.query as { projectId: string };

  const tasks = await dataSource
    .getRepository(Task)
    .createQueryBuilder("task")
    .leftJoinAndSelect("task.project", "project")
    .leftJoinAndSelect("task.assignee", "assignee")
    .leftJoin(ActivityLogs, "al", "al.taskId = task.id")
    .leftJoin("al.performedBy", "creator")
    .select([
      "task.id",
      "task.title",
      "task.status",
      "task.version",
      "task.createdAt",
      "project.id",
      "project.name",
      "assignee.id",
      "assignee.email",
      "creator.id",
      "creator.email",
    ])
    .where("task.project = :projectId", { projectId })
    .andWhere("task.deletedAt IS NULL")
    .getRawMany();

  return res.status(httpStatus.OK).send({
    data: tasks.map(mapTask),
    status: httpStatus.OK,
  });
});

export const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { status } = req.body;
    const { id: userId } = req.user as User;

    await dataSource.transaction(async (txn) => {
      const task = await txn.findOne(Task, {
        where: { id, deletedAt: IsNull() },
      });
      if (!task)
        return next(
          new ServerError({
            message: `Task not found for id ${id}`,
            status: httpStatus.NOT_FOUND,
          }),
        );

      if (task.status === status) {
        throw new ServerError({
          message: `Task is already in ${status}`,
          status: httpStatus.BAD_REQUEST,
        });
      }

      const result = await txn.update(
        Task,
        { id, version: task.version },
        { status },
      );

      if (result.affected !== 1) {
        return next(
          new ServerError({
            message: `Failed to update the task ${id}`,
            status: httpStatus.CONFLICT,
          }),
        );
      }

      await txn.getRepository(ActivityLogs).save({
        taskId: id,
        performedById: userId,
        action: "TASK_UPDATED",
      });
    });

    res.status(200).json({ success: true });
  },
);

export const deleteTask = catchAsync(async (req, res, next) => {
  const { id } = req.params as { id: string };
  const { id: userId } = req.user as User;

  await dataSource.transaction(async (txn) => {
    const result = await txn.update(
      Task,
      { id, deletedAt: IsNull() },
      { deletedAt: new Date() },
    );

    if (result.affected !== 1) {
      next(
        new ServerError({
          message: "Task not found or already deleted",
          status: httpStatus.NOT_FOUND,
        }),
      );
    }

    await txn.insert(ActivityLogs, {
      taskId: id,
      action: "TASK_DELETED",
      performedById: userId,
    });
  });

  res.status(200).json({ success: true });
});
