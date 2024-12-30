import { NextFunction, query, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import TenantService from "../services/tenantService";
import { Logger } from "winston";
import { ERROR_MESSAGES } from "../constants/constants";
import { RegisterTenantRequest } from "../types/types";

export default class TenantController {
  constructor(
    private tenantService: TenantService,
    private logger: Logger
  ) {}

  async createTenant(
    req: RegisterTenantRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const result = validationResult(req);
      if (!result.isEmpty()) {
        res.status(400).json({ errors: result.array() });
        return;
      }
      const { name, address } = req.body;
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

  async getTenantsList(req: Request, res: Response, next: NextFunction) {
    try {
      const tenants = await this.tenantService.getTenantsLists();

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

  async getTenants(req: Request, res: Response, next: NextFunction) {
    const queryParams: {
      currentPage: number;
      pageSize: number;
      role: string | null;
      search: string;
    } = matchedData(req, { onlyValidData: true });
    try {
      const { tenants, totalDocuments } = await this.tenantService.getTenants(
        queryParams.currentPage,
        queryParams.pageSize,
        queryParams.search
      );

      res.status(200).json({
        result: tenants,
        message: "Tenants fetched successfully",
        meta: {
          currentPage: queryParams.currentPage,
          pageSize: queryParams.pageSize,
          totalDocuments,
        },
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
