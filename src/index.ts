import cors from "cors";
import express from "express";
import helmet from "helmet";
import httpStatus from "http-status";

import { connectDatabase, env } from "@config";
import { errorHandler, initPassport, requestLogger } from "@middlewares";
import useRoutes from "@routes";
import { logger } from "@utils";

const app = express();

app.use(requestLogger);

app.use(helmet());

app.use(cors());

app.use(express.json());

connectDatabase();

initPassport(app);

app.get("/health", (_, res) =>
  res.status(httpStatus.OK).json({
    status: "up",
  }),
);

useRoutes(app);

app.use(errorHandler);

app.listen(env.PORT, () => logger.info(`Server started on port ${env.PORT}`));
