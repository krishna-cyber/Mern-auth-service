import winston from "winston";
import { Config } from "./config";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "auth-service" },
  transports: [
    //logs upto level of info and stores in app.log file
    new winston.transports.File({
      dirname: "logs",
      filename: "app.log",
      level: "info",
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp()
      ),
      silent: Config.NODE_ENV === "test",
    }),

    //logs upto level of error and save in error.log
    new winston.transports.File({
      dirname: "logs",
      filename: "error.log",
      level: "error",
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp()
      ),
      silent: Config.NODE_ENV === "development",
    }),
    new winston.transports.File({
      dirname: "logs",
      filename: "info.log",
      level: "info",
      format: winston.format.combine(
        winston.format.prettyPrint(),
        winston.format.timestamp()
      ),
      silent: Config.NODE_ENV === "development",
    }),

    //logs upto level of debug and console logs
    new winston.transports.Console({
      level: "debug",
      format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp(),
        winston.format.prettyPrint()
      ),
      silent: Config.NODE_ENV === "production",
    }),
  ],
});

export default logger;
