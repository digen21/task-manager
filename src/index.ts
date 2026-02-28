import cors from "cors";
import express from "express";
import httpStatus from "http-status";

import { connectDatabase, env } from "@config";
import { errorHandler, requestLogger } from "@middlewares";
import useRoutes from "@routes";
import { logger } from "@utils";

const app = express();

app.use(requestLogger);

app.use(cors());

app.use(express.json());

connectDatabase();

app.get("/health", (_, res) =>
  res.status(httpStatus.OK).json({
    status: "up",
  }),
);

useRoutes(app);

app.use(errorHandler);

app.listen(env.PORT, () => logger.info(`Server started on port ${env.PORT}`));
