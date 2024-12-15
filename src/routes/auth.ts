import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import AuthController from "../controller/authController";
import { User } from "../entity/User";
import UserService from "../services/userService";
import logger from "../config/logger";
import registerValidator from "../validators/registerValidator";
import TokenService from "../services/tokenService";
import { RefreshToken } from "../entity/RefreshToken";
import loginValidator from "../validators/loginValidator";
import CredentialService from "../services/credentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types/types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";
const authRouter = Router();

const userService = new UserService(User);
const tokenService = new TokenService(RefreshToken);
const credentialService = new CredentialService(User);

const authController = new AuthController(
  tokenService,
  userService,
  credentialService,
  logger
);

authRouter.get(
  "/self",
  authenticate as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => {
    authController.self(req as AuthRequest, res, next);
  }
);

authRouter.post(
  "/register",
  registerValidator,
  (req: Request, res: Response, next: NextFunction) => {
    authController.register(req, res, next);
  }
);

authRouter.post(
  "/login",
  loginValidator,
  (req: Request, res: Response, next: NextFunction) => {
    authController.login(req, res, next);
  }
);

authRouter.post(
  "/refresh",
  validateRefreshToken as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => {
    authController.refresh(req as AuthRequest, res, next);
  }
);

authRouter.get(
  "/logout",
  authenticate as RequestHandler,
  parseRefreshToken as RequestHandler,
  (req: Request, res: Response, next: NextFunction) => {
    authController.logout(req as AuthRequest, res, next);
  }
);

export default authRouter;
