import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { AppDataSource as dataSource } from "@config";
import { ActivityLogs, Task, User } from "@entity";
import { projectService } from "@services";
import { catchAsync, getPaginationOptions, mapTask, ServerError } from "@utils";
import { IsNull } from "typeorm";
import { TaskStatus } from "@types";

export const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, status, projectId, assigneeId, dueDate } = req.body;
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
        dueDate,
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
      "task.due_date",
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
  const { projectId, page = 1, limit = 10, status } = req.query;

  const { skip, limit: tale } = getPaginationOptions(
    Number(page),
    Number(limit),
  );

  const query = dataSource
    .getRepository(Task)
    .createQueryBuilder("task")
    .leftJoin("task.project", "project")
    .leftJoin("task.assignee", "assignee")
    .leftJoin(
      ActivityLogs,
      "al",
      "al.taskId = task.id AND al.action = :action",
      { action: "TASK_CREATED" },
    )
    .leftJoin("al.performedBy", "creator")
    .where("task.project = :projectId", { projectId })
    .andWhere("task.deletedAt IS NULL");

  if (status) {
    query.andWhere("task.status = :status", { status });
  }

  const [tasks, statusCount, total] = await Promise.all([
    query
      .clone()
      .select([
        "task.id",
        "task.title",
        "task.status",
        "task.due_date",
        "task.version",
        "task.createdAt",
        "project.id",
        "project.name",
        "assignee.id",
        "assignee.email",
        "creator.id",
        "creator.email",
      ])
      .skip(skip)
      .take(tale)
      .getRawMany(),

    query
      .clone()
      .select("task.status", "status")
      .addSelect("COUNT(task.id)", "count")
      .groupBy("task.status")
      .getRawMany(),

    query.clone().getCount(),
  ]);

  return res.status(httpStatus.OK).send({
    data: tasks.map(mapTask),
    statusCount,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
    status: httpStatus.OK,
  });
});

export const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { status, completedAt } = req.body as Partial<Task>;

    if (status === TaskStatus.DONE && !completedAt) {
      req.body.completedAt = new Date();
    }

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
        req.body,
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
