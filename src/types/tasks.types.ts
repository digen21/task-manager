import { Task } from "@entity";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export type UpdateTaskInput = Partial<Omit<Task, "id">>;
export type GetByTaskInput = Partial<Task>;
