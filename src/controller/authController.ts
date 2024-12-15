import { NextFunction, Request, Response } from "express";
import { AuthRequest, UserData } from "../types/types";
import UserService from "../services/userService";
import { Logger } from "winston";
import { validationResult } from "express-validator";

import TokenService from "../services/tokenService";
import CredentialService from "../services/credentialService";
import createHttpError from "http-errors";
import { ERROR_MESSAGES } from "../constants/constants";

interface RegisterUserRequest extends Request {
  body: UserData;
}
class AuthController {
  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private credentialService: CredentialService,
    private logger: Logger
  ) {}

  async resCookieAccessTokenAndRefreshToken(
    res: Response,
    accessToken: string,
    refreshToken: string
  ) {
    res.cookie("accessToken", accessToken, {
      domain: "localhost",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, //1 hr to expire
    });

    res.cookie("refreshToken", refreshToken, {
      domain: "localhost",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 24 * 30, //1 month to expire
    });
  }

  async register(req: RegisterUserRequest, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const { firstName, lastName, email, password, role } = req.body;
      this.logger.debug(`User registration request`, {
        firstName,
        lastName,
        email,
      });
      const user = await this.userService.create({
        firstName,
        lastName,
        email,
        password,
        role,
      });
      this.logger.info(`User registered successfully`, {
        firstName,
        lastName,
        email,
      });

      const payload = {
        sub: String(user._id),
        role: user.role,
      };

      const accessToken: string = this.tokenService.getAccessToken(payload);
      const refreshToken: string =
        await this.tokenService.getRefreshToken(payload);

      this.resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken);
      // @ts-ignore
      const { password: pw, ...userData } = user._doc;

      res.status(201).json({
        result: userData,
        message: "User registered successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  //login controller
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
      const { email, password } = req.body;

      //check for email and password matched or not
      const user = await this.userService.findUserByEmail(email, true);

      if (!user) {
        const err = createHttpError(400, ERROR_MESSAGES.INVALID_CREDENTIALS);
        next(err);
        return;
      }

      const isMatched: boolean =
        await this.credentialService.checkForPasswordMatch(
          password,
          user.password
        );

      if (!isMatched) {
        const err = createHttpError(400, ERROR_MESSAGES.INVALID_CREDENTIALS);
        next(err);
        return;
      }

      const payload = {
        sub: String(user._id),
        role: user.role,
      };

      const accessToken: string = this.tokenService.getAccessToken(payload);
      const refreshToken: string =
        await this.tokenService.getRefreshToken(payload);

      this.resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken);

      console.log(user._id);
      //@ts-ignore
      res.status(200).json({
        result: { id: user._id },
        message: "User login successfully",
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async self(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findUserById(req.auth.sub!);

      res.status(200).json({
        result: user,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async refresh(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.findUserById(req.auth.sub!);

      if (!user) {
        const err = createHttpError(410, ERROR_MESSAGES.USER_DELETED);
        next(err);
        return;
      }
      const payload = {
        sub: String(user._id),
        role: user.role,
      };

      const accessToken: string = this.tokenService.getAccessToken(payload);
      const refreshToken: string =
        await this.tokenService.getRefreshToken(payload);

      this.tokenService.removeRefreshToken(req.auth.jti!);

      this.resCookieAccessTokenAndRefreshToken(res, accessToken, refreshToken);

      res.status(200).json({});
    } catch (error) {
      next(error);
      return;
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      await this.tokenService.removeRefreshToken(req.auth.jti!);
      this.logger.info(`User logged out successfully`, req.auth.sub);

      this.logger.info(`Refresh token removed successfully`, req.auth.jti);

      res.clearCookie("accessToken");

      res.clearCookie("refreshToken");

      res.status(200).json({});
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
