import {
  NextFunction,
  Request,
  RequestHandler,
  Response,
  Router,
} from "express";
import TenantController from "../controller/tenantController";
import TenantService from "../services/tenantService";
import { Tenants } from "../entity/Tenants";
import logger from "../config/logger";
import authenticate from "../middlewares/authenticate";
import canAccess from "../middlewares/canAccess";
import { ROLES } from "../constants/constants";
import queryParamValidator from "../validators/queryParamsValidator";
import tenantCreateValidator from "../validators/tenantCreateValidator";
const tenantRouter = Router();

const tenantservice = new TenantService(Tenants);
const tenantController = new TenantController(tenantservice, logger);

tenantRouter.post(
  "/",
  tenantCreateValidator as RequestHandler,
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]) as RequestHandler,

  (req: Request, res: Response, next: NextFunction) =>
    tenantController.createTenant(req, res, next)
);

tenantRouter.get("/lists", (req: Request, res: Response, next: NextFunction) =>
  tenantController.getTenantsList(req, res, next)
);

tenantRouter.get(
  "/",
  authenticate as RequestHandler,
  canAccess([ROLES.ADMIN]) as RequestHandler,
  queryParamValidator,
  (req: Request, res: Response, next: NextFunction) =>
    tenantController.getTenants(req, res, next)
);

tenantRouter
  .route("/:id")
  .get(
    authenticate as RequestHandler,
    canAccess([ROLES.ADMIN]) as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
      tenantController.getTenantById(req, res, next)
  )
  .patch(
    authenticate as RequestHandler,
    canAccess([ROLES.ADMIN]) as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
      tenantController.updateTenantById(req, res, next)
  )
  .delete(
    authenticate as RequestHandler,
    canAccess([ROLES.ADMIN]) as RequestHandler,
    (req: Request, res: Response, next: NextFunction) =>
      tenantController.deleteTenantById(req, res, next)
  );

export default tenantRouter;
