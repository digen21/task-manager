import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

import { AppDataSource as dataSource, env } from "@config";
import { organizationService, userService } from "@services";
import { catchAsync, ServerError } from "@utils";
import { Organizations, User } from "@entity";
import { UserRoles } from "@types";

// only work for admin
export const register = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, organizationName } = req.body;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await userService.get({ email: normalizedEmail });

    const existsOrganizartion = await organizationService.get({
      name: organizationName,
    });

    if (existsOrganizartion)
      return next(
        new ServerError({
          message: "Organization already exists",
          status: httpStatus.CONFLICT,
        }),
      );

    if (user)
      return next(
        new ServerError({
          message: "User Already Exists...",
          status: httpStatus.BAD_REQUEST,
        }),
      );

    const result = await dataSource.transaction(async (txn) => {
      const organization = await txn.save(Organizations, {
        name: organizationName,
      });

      const hashPassword = await bcrypt.hash(password, 10);

      return txn.save(User, {
        email: normalizedEmail,
        password: hashPassword,
        role: UserRoles.ADMIN,
        organizationId: organization.id,
      });
    });

    if (result) {
      return res.status(httpStatus.CREATED).send({
        message: "Registered Successfully...",
        status: httpStatus.CREATED,
      });
    }

    throw new ServerError({
      message: "Failed to register",
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, email } = req.body;

    const user = await userService.getByEmail(email);

    if (!user) {
      return next(
        new ServerError({
          message: "Invalid Credential",
          status: httpStatus.FORBIDDEN,
        }),
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new ServerError({
        message: "Invalid Credential",
        status: httpStatus.FORBIDDEN,
      });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role!,
        organizationId: user.organizationId,
      },
      env.JWT_SECRET!,
      {
        expiresIn: "10d",
      },
    );

    return res.status(httpStatus.OK).send({
      success: true,
      token,
      status: httpStatus.OK,
      message: "Login Successfully",
    });
  },
);

export const profile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user)
      return next(
        new ServerError({
          message: "Unauthorized",
          status: httpStatus.UNAUTHORIZED,
        }),
      );

    return res.status(httpStatus.OK).json({
      data: req.user,
    });
  },
);
