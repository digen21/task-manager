import { Request, Response } from "express";
import httpStatus from "http-status";

import { AppDataSource as dataSource } from "@config";
import { ActivityLogs, Task } from "@entity";
import { TaskStatus } from "@types";
import { catchAsync } from "@utils";
import { Brackets } from "typeorm";

export const getTaskActivity = catchAsync(
  async (req: Request, res: Response) => {
    const { taskId } = req.params;

    const activities = await dataSource
      .getRepository(ActivityLogs)
      .createQueryBuilder("al")
      .leftJoin("al.performedBy", "user")
      .select([
        "al.id AS id",
        "al.action AS action",
        "al.createdAt AS createdAt",
        "user.id AS userId",
        "user.email AS userEmail",
      ])
      .where("al.taskId = :taskId", { taskId })
      .orderBy("al.createdAt", "DESC")
      .getRawMany();

    res.status(httpStatus.OK).send({
      data: activities,
      status: httpStatus.OK,
    });
  },
);

export const getTaskAnalytics = catchAsync(async (req, res) => {
  const { projectId } = req.query as { projectId: string };

  const [completedPerUser, overdueCount, avgCompletion] = await Promise.all([
    dataSource
      .getRepository(Task)
      .createQueryBuilder("task")
      .leftJoin("task.assignee", "user")
      .select("user.id", "userId")
      .addSelect("user.email", "email")
      .addSelect("COUNT(task.id)", "completedCount")
      .where("task.status = :status", { status: TaskStatus.DONE })
      .andWhere("task.deletedAt IS NULL")
      .andWhere("task.projectId = :projectId", { projectId })
      .groupBy("user.id")
      .addGroupBy("user.email")
      .getRawMany(),

    dataSource
      .getRepository(Task)
      .createQueryBuilder("task")
      .where(
        new Brackets((qb) => {
          // due date is passed or completed after due date
          qb.where("task.dueDate < NOW()").orWhere(
            "task.completedAt > task.dueDate",
          );
        }),
      )
      .andWhere("task.status != :done", { done: TaskStatus.DONE })
      .andWhere("task.deletedAt IS NULL")
      .andWhere("task.projectId = :projectId", { projectId })
      .getCount(),

    dataSource
      .getRepository(Task)
      .createQueryBuilder("task")
      .select(
        "AVG(TIMESTAMPDIFF(SECOND, task.createdAt, task.completedAt)) / 3600",
        "avgTime",
      )
      .where("task.status = :done", { done: TaskStatus.DONE })
      .andWhere("task.completedAt IS NOT NULL")
      .andWhere("task.deletedAt IS NULL")
      .andWhere("task.projectId = :projectId", { projectId })
      .getRawOne(),
  ]);

  res.status(httpStatus.OK).json({
    data: {
      completedPerUser,
      overdueCount,
      avgCompletionTimeInSeconds: Number(avgCompletion?.avgTime ?? 0).toFixed(
        2,
      ),
    },
  });
});
