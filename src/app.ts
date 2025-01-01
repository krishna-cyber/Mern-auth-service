import "reflect-metadata";

import express, { NextFunction, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth";
import cors from "cors";
// import "./data-source";

import "../src/data-source";
import "./seeders/adminSeeder";
import tenantRouter from "./routes/tenant";
import userRouter from "./routes/user";
import globalErrorHandler from "./middlewares/globalErrorHandler";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.use(morgan("dev"));

// router binding
app.use("/auth", authRouter);
app.use("/tenants", tenantRouter);
app.use("/users", userRouter);

app.use(globalErrorHandler);

export default app;
