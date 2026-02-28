import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.simple(),
    format.colorize(),
    format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console({
      format: format.simple(),
    }),
    new transports.File({ filename: "./logger/error.log", level: "error" }),
    new transports.File({ filename: "./logger/warn.log", level: "warn" }),
    new transports.File({ filename: "./logger/info.log", level: "info" }),
  ],
});

export default logger;
