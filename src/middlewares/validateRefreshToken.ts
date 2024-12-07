import { Request } from "express";
import { expressjwt } from "express-jwt";
import * as jwt from "jsonwebtoken";
import { AuthCookie } from "../types/types";
import { Config } from "../config/config";
import { RefreshToken } from "../entity/RefreshToken";
import logger from "../config/logger";

export default expressjwt({
  secret: Config.JWT_REFRESH_TOKEN_SECRET!,
  algorithms: ["HS256"],
  getToken(req: Request) {
    const { refreshToken } = req.cookies as AuthCookie;
    return refreshToken;
  },
  async isRevoked(req: Request, token) {
    try {
      const refreshToken = await RefreshToken.findById(
        (token?.payload as jwt.JwtPayload).jti
      );
      return refreshToken == null;
    } catch (error) {
      logger.error(error);
      return true;
    }
  },
});
