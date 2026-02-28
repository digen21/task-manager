import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { ErrorType } from "@types";
import { ServerError } from "@utils";

const errorHandler = (
  err: ErrorType,
  _: Request,
  res: Response,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  if (err instanceof ServerError)
    return res.status(err.status).send({
      status: err.status,
      message: err.message,
    });

  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    message: "Internal Server Error",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandler;
