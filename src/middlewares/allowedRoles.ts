import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { UserRoles } from "@types";

interface IUser {
  userId: string;
  role: UserRoles;
}

const allowedRoles =
  (roles: string | string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    const user = req.user as IUser;
    const userRoles = Array.isArray(user.role) ? user.role : [user.role];
    if (userRoles.some((r) => allowed.includes(r))) return next();
    return res
      .status(httpStatus.FORBIDDEN)
      .json({ message: "Forbidden", status: httpStatus.FORBIDDEN });
  };

export const isAdminRole = allowedRoles(UserRoles.ADMIN);
export const isUserRole = allowedRoles(UserRoles.MEMBER);

export default allowedRoles;
