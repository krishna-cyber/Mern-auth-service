"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = __importDefault(require("winston"));
const config_1 = require("./config");
const logger = winston_1.default.createLogger({
    level: "info",
    format: winston_1.default.format.json(),
    defaultMeta: { service: "auth-service" },
    transports: [
        //logs upto level of info and stores in app.log file
        new winston_1.default.transports.File({
            dirname: "logs",
            filename: "app.log",
            level: "info",
            format: winston_1.default.format.combine(winston_1.default.format.prettyPrint(), winston_1.default.format.timestamp()),
            silent: config_1.Config.NODE_ENV === "test",
        }),
        //logs upto level of error and save in error.log
        new winston_1.default.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            format: winston_1.default.format.combine(winston_1.default.format.prettyPrint(), winston_1.default.format.timestamp()),
            silent: config_1.Config.NODE_ENV === "development",
        }),
        new winston_1.default.transports.File({
            dirname: "logs",
            filename: "info.log",
            level: "info",
            format: winston_1.default.format.combine(winston_1.default.format.prettyPrint(), winston_1.default.format.timestamp()),
            silent: config_1.Config.NODE_ENV === "development",
        }),
        //logs upto level of debug and console logs
        new winston_1.default.transports.Console({
            level: "debug",
            format: winston_1.default.format.combine(winston_1.default.format.json(), winston_1.default.format.timestamp(), winston_1.default.format.prettyPrint()),
            silent: config_1.Config.NODE_ENV === "production",
        }),
    ],
});
exports.default = logger;
