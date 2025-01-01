import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { v4 as uuid } from "uuid";
import logger from "../config/logger";

const globalErrorHandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errorId = uuid();
  const statusCode = err.status || err.statusCode || 500;

  const isProduction = process.env.NODE_ENV == "production";

  const errMessage = isProduction ? "Internal server error" : err.message;

  logger.error(err.message, {
    id: errorId,
    statusCode,
    err: err.stack,
    path: req.path,
    method: req.method,
  });

  res.status(statusCode).json({
    errors: [
      {
        ref: errorId,
        type: err.name,
        value: err.value || "",
        msg: errMessage,
        path: req.path || "",
        method: req.method,
        stack: isProduction ? null : err.stack,
      },
    ],
  });
};

export default globalErrorHandler;
