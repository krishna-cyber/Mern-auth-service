import { NextFunction, Request, Response } from "express";
import TenantService from "../services/tenantService";
import { Logger } from "winston";
import { ERROR_MESSAGES } from "../constants/constants";

export default class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger
  ) {}

  async createTenant(req: Request, res: Response, next: NextFunction) {
    const { name, address } = req.body;
    try {
      const tenant = await this.tenantService.createTenant(
        name as string,
        address as string
      );

      this.logger.info(`Tenant created successfully`, tenant._id);

      res.status(201).json({
        result: tenant,
        message: "Tenant created successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getTenants(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getTenants();

      res.status(200).json({
        result: tenants,
        message: "Tenants fetched successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async getTenantById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const tenant = await this.tenantService.getTenantById(id);

      if (!tenant) {
        res.status(404).json({
          result: null,
          message: ERROR_MESSAGES.RESOURCES_NOT_FOUND,
          meta: null,
        });
        return;
      }

      res.status(200).json({
        result: tenant,
        message: "Tenants fetched successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
      return;
    }
  }

  async deleteTenantById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      await this.tenantService.deleteTenantById(id);
      res.json({
        result: null,
        message: "Tenant deleted successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
  async updateTenantById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const data = req.body;
    try {
      const updatedTenant = await this.tenantService.updateTenantById(id, data);
      res.json({
        result: updatedTenant,
        message: "Tenant updated successfully",
        meta: null,
      });
    } catch (error) {
      next(error);
      return;
    }
  }
}
