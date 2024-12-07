import jwt, { JwtPayload } from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { Config } from "../config/config";
import createHttpError from "http-errors";
import { Model } from "mongoose";
import { RefreshTokenDocument } from "../entity/RefreshToken";

class TokenService {
  constructor(private RefreshToken: Model<RefreshTokenDocument>) {}

  //get private key for JWT
  getAccessTokenPrivateKey(): Buffer {
    let privateK: Buffer;
    try {
      privateK = fs.readFileSync(
        path.join(__dirname, "../../certs/privateKey.pem")
      );
      return privateK;
    } catch (error) {
      const err = createHttpError(500, "Error generating private key for JWT");
      throw err;
    }
    return privateK;
  }

  //return accessToken
  getAccessToken(payload: JwtPayload) {
    const accessTokenPrivateKey = this.getAccessTokenPrivateKey();
    return jwt.sign(payload, accessTokenPrivateKey, {
      algorithm: "RS256",
      expiresIn: "1h",
      issuer: "authService",
    });
  }

  //return refreshtoken
  async getRefreshToken(payload: JwtPayload) {
    const { _id } = await this.saveRefreshToken(payload.sub);
    return jwt.sign(payload, String(Config.JWT_REFRESH_TOKEN_SECRET), {
      jwtid: String(_id),
      algorithm: "HS256",
      expiresIn: "30d",
      issuer: "authService",
    });
  }

  //persist refreshToken in DB
  saveRefreshToken(userId: unknown) {
    try {
      const refreshToken = new this.RefreshToken({
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), //30 days
      });
      return refreshToken.save();
    } catch (error) {
      console.log(error);
      const err = createHttpError(500, "Error saving refresh token");
      throw err;
    }
  }

  //remove refreshToken from DB
  async removeRefreshToken(jti: string) {
    try {
      return await this.RefreshToken.findByIdAndDelete(jti);
    } catch (error) {
      const err = createHttpError(500, "Error removing refresh token");
      throw err;
    }
  }
}

export default TokenService;
