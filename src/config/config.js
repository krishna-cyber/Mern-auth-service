"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.envPath = exports.Config = void 0;
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.join(__dirname, `../../.env.${process.env.NODE_ENV}`);
exports.envPath = envPath;
(0, dotenv_1.config)({ path: envPath });
const { PORT, NODE_ENV, MONGO_URI_ATLAS, DB_NAME, JWT_REFRESH_TOKEN_SECRET, JWKS_URI, PRIVATE_KEY, } = process.env;
const Config = {
    PORT,
    NODE_ENV,
    MONGO_URI_ATLAS,
    DB_NAME,
    JWT_REFRESH_TOKEN_SECRET,
    JWKS_URI,
    PRIVATE_KEY,
};
exports.Config = Config;
