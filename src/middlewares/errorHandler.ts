import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

import { ErrorType } from "@types";
import { logger, ServerError } from "@utils";
import { QueryFailedError } from "typeorm";

const errorHandler = (
  err: ErrorType,
  _: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
) => {
  // database error
  if (err instanceof QueryFailedError) {
    logger.error("Database Error: ", {
      err: err.driverError,
    });

    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      message: err.message,
      status: httpStatus.INTERNAL_SERVER_ERROR,
    });
  }

  // custom error
  if (err instanceof ServerError) {
    logger.error("Server Error: ", {
      err,
    });

    return res.status(err.status).send({
      status: err.status,
      message: err.message,
    });
  }

  // unhandled error
  logger.error("Unwanted Error: ", {
    err,
  });
  return res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
    message: "Internal Server Error",
    status: httpStatus.INTERNAL_SERVER_ERROR,
  });
};

export default errorHandler;
