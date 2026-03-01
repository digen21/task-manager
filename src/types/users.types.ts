import { User } from "@entity";

export enum UserRoles {
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export type UpdateUserInput = Partial<Omit<User, "id">>;
export type GetByUserInput = Partial<User>;
