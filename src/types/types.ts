import { Request } from "express";
import * as jwt from "jsonwebtoken";

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
}

interface AuthRequest extends Request {
  auth: jwt.JwtPayload;
}

interface AuthCookie {
  accessToken: string;
  refreshToken: string;
}

interface TenantData {
  name: string;
  address: string;
}

interface RegisterTenantRequest extends Request {
  body: TenantData;
}

export { UserData, AuthRequest, AuthCookie, RegisterTenantRequest };
