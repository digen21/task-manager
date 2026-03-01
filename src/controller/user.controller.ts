import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { AppDataSource as dataSource } from "@config";
import { User } from "@entity";
import { userService } from "@services";
import { UserRoles } from "@types";
import { catchAsync, ServerError } from "@utils";

// only work for admin
export const createMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    const { organizationId } = req.user as User;

    // user already belong to organization
    const existsUser = await dataSource
      .getRepository(User)
      .createQueryBuilder("user")
      .select("user.id")
      .where(
        "LOWER(user.email) = LOWER(:email) AND user.organization = :organizationId",
        { email, organizationId },
      )
      .getOne();

    if (existsUser) {
      return next(
        new ServerError({
          message: `User already belong to organization ${organizationId}`,
          status: httpStatus.CONFLICT,
        }),
      );
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const result: Omit<User, "password"> = await userService.create({
      email,
      password: hashPassword,
      role: req.body.role ?? UserRoles.MEMBER,
      organizationId,
    });

    if (result) {
      return res.status(httpStatus.CREATED).send({
        message: "Member created successfully",
        data: result,
        status: httpStatus.CREATED,
      });
    }

    throw new ServerError({
      message: "Failed to create the member",
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  },
);

export const getMembers = catchAsync(async (req: Request, res: Response) => {
  const { organizationId } = req.user as User;

  const members = await userService.getAll({
    where: { organizationId, role: UserRoles.MEMBER },
    order: { createdAt: "desc" },
    select: {
      password: false,
      deletedAt: false,
    },
  });

  return res.status(httpStatus.OK).send({
    data: members,
    status: httpStatus.OK,
  });
});
