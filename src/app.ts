import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { HttpError } from "http-errors";
import logger from "./config/logger";
import authRouter from "./routes/auth";
// import "./data-source";

import "../src/data-source";
import "./seeders/adminSeeder";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";

const app = express();

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
app.use(morgan("dev"));

// get connected with database and start the server

// router binding
app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

// app.post(
//   "/auth/register",
//   (req: Request, res: Response, next: NextFunction) => {
//     const err = createHttpError(401, "You can't access this route");
//     res.status(200).json({ message: "Hello World" });
//     next(err);
//   }
// );

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message, err.statusCode);
  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        value: err.value || "",
        msg: err.message,
        path: err.path || "",
        location: err.location || "",
      },
    ],
  });
});

export default app;
