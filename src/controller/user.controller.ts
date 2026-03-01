import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { organizationService, userService } from "@services";
import { UserRoles } from "@types";
import { catchAsync, ServerError } from "@utils";

// only work for admin
export const createMember = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, organizationId } = req.body;

    const existsOrganizartion = await organizationService.get({
      id: organizationId,
    });

    if (!existsOrganizartion)
      return next(
        new ServerError({
          message: `Organization with id ${organizationId} does not exists`,
          status: httpStatus.NOT_FOUND,
        }),
      );

    const normalizedEmail = email.trim().toLowerCase();

    const user = await userService.get({ email: normalizedEmail });

    if (user)
      return next(
        new ServerError({
          message: "User Already Exists...",
          status: httpStatus.BAD_REQUEST,
        }),
      );

    const hashPassword = await bcrypt.hash(password, 10);

    const result = await userService.create({
      email: normalizedEmail,
      password: hashPassword,
      role: req.body.role ?? UserRoles.MEMBER,
      organizationId: existsOrganizartion.id,
    });

    console.log("result :: ", result);

    if (result?.raw[0]) {
      return res.status(httpStatus.CREATED).send({
        message: "Member created successfully",
        data: result.raw[0],
        status: httpStatus.CREATED,
      });
    }

    throw new ServerError({
      message: "Failed to create the member",
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  },
);
