import { expressjwt, GetVerificationKey } from "express-jwt";
import { Request } from "express";
import JwksRsa from "jwks-rsa";
import { Config } from "../config/config";
import { AuthCookie } from "../types/types";
export default expressjwt({
  secret: JwksRsa.expressJwtSecret({
    jwksUri: Config.JWKS_URI!,
    cache: true,
    rateLimit: true,
  }) as GetVerificationKey,
  algorithms: ["RS256"],
  getToken(req: Request) {
    const authHeader = req.headers.authorization;

    // Bearer eyjllsdjfljlasdjfljlsadjfljlsdf
    if (authHeader && authHeader.split(" ")[1] !== "undefined") {
      const token = authHeader.split(" ")[1];
      if (token) {
        return token;
      }
    }

    const { accessToken } = req.cookies as AuthCookie;
    return accessToken;
  },
});
