import { ServerError } from "@utils";
import { QueryFailedError } from "typeorm";

export type ErrorType = Error | ServerError | QueryFailedError;
