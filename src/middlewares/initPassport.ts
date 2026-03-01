import { Express } from "express";
import httpStatus from "http-status";
import passport from "passport";
import { ExtractJwt, Strategy, VerifiedCallback } from "passport-jwt";

import { env } from "@config";
import { userService } from "@services";
import { logger, ServerError } from "@utils";

export interface IUser {
  userId: string;
  role: string;
}

export default (app: Express) => {
  const options = {
    secretOrKey: env.JWT_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

  try {
    passport.use(
      new Strategy(options, async (payload: IUser, done: VerifiedCallback) => {
        if (!payload) {
          return done(null, false);
        }

        const userId = payload?.userId;
        const user = await userService.get({ id: userId });

        return done(null, user || false);
      }),
    );

    app.use(passport.initialize());
  } catch (error) {
    logger.error(error);
    throw new ServerError({
      message: "Unauthorized",
      status: httpStatus.UNAUTHORIZED,
    });
  }
};
