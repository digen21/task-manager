import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { ObjectSchema } from "joi";

import { ServerError } from "@utils";

const validate = (schema: ObjectSchema) => {
  return (req: Request, _: Response, next: NextFunction) => {
    const { error, value } = schema.validate(
      {
        body: req.body,
        query: req.query,
        params: req.params,
      },
      {
        abortEarly: false,
        stripUnknown: true,
      },
    );

    if (error) {
      return next(
        new ServerError({
          message: JSON.stringify(error.details.map((error) => error.message)),
          status: httpStatus.BAD_REQUEST,
        }),
      );
    }

    if (req.body) Object.assign(req.body, value);
    if (req.query) Object.assign(req.query, value);
    if (req.params) Object.assign(req.params, value);
    next();
  };
};

export default validate;
