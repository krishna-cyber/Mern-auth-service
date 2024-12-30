import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import canAccess from "../middlewares/canAccess";
import { ROLES } from "../constants/constants";
import UserService from "../services/userService";
import { User } from "../entity/User";
import UserController from "../controller/userController";
import validateUserUpdataData from "../validators/validateUserUpdataData";
import queryParamValidator from "../validators/queryParamsValidator";
const userRouter = Router();

const userService = new UserService(User);
const userController = new UserController(userService, logger);

userRouter.post(
  "/",
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]) as RequestHandler,
  (req: Request, res: Response, next: NextFunction) =>
    userController.createUser(req, res, next)
);

userRouter.get(
  "/",
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]) as RequestHandler,
  queryParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    userController.getUsers(req, res, next)
);

userRouter
  .route("/:id")
  .get(
    authenticate as RequestHandler,
    canAccess([ROLES.ADMIN]) as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
      userController.getUserDetailsById(req, res, next)
  )
  .patch(
    authenticate as RequestHandler,
    canAccess([ROLES.ADMIN]) as RequestHandler,
    validateUserUpdataData,
    (req: Request, res: Response, next: NextFunction) =>
      userController.updateUserById(req, res, next)
  )
  .delete(
    authenticate as RequestHandler,
    canAccess([ROLES.ADMIN]) as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
      userController.deleteUserById(req, res, next)
  );

export default userRouter;
