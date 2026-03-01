import { Project } from "@entity";

export type UpdateProjectInput = Partial<Omit<Project, "id">>;
export type GetByProjectInput = Partial<Project>;
