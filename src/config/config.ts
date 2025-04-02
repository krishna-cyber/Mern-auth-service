import { config } from "dotenv";
import path from "path";

const envPath = path.join(__dirname, `../../.env.${process.env.NODE_ENV}`);

config({ path: envPath });
const {
  PORT,
  NODE_ENV,
  MONGO_URI_ATLAS,
  DB_NAME,
  JWT_REFRESH_TOKEN_SECRET,
  JWKS_URI,
  PRIVATE_KEY,
} = process.env;

const Config = {
  PORT,
  NODE_ENV,
  MONGO_URI_ATLAS,
  DB_NAME,
  JWT_REFRESH_TOKEN_SECRET,
  JWKS_URI,
  PRIVATE_KEY,
};

Object.freeze(Config);

export { Config, envPath };
