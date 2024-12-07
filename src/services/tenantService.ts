import { Model } from "mongoose";
import { TenantsDocument } from "../entity/Tenants";
import createHttpError from "http-errors";

export default class TenantService {
  constructor(private Tenant: Model<TenantsDocument>) {}

  async createTenant(name: string, address: string) {
    try {
      const tenant = new this.Tenant({
        name,
        address,
      });

      return await tenant.save();
    } catch (error) {
      const err = createHttpError(500, "Error while creating tenant");
      throw err;
    }
  }

  async getTenants() {
    try {
      return await this.Tenant.find({});
    } catch (error) {
      const err = createHttpError(500, "Error while fetching tenants");
      throw err;
    }
  }

  async getTenantById(id: string) {
    try {
      return await this.Tenant.findById(id);
    } catch (error) {
      const err = createHttpError(500, "Error while fetching tenant");
      throw err;
    }
  }
  async deleteTenantById(_id: string) {
    try {
      return await this.Tenant.deleteOne({ _id });
    } catch (error) {
      const err = createHttpError(500, "Error while deleting tenant");
      throw err;
    }
  }
  async updateTenantById(_id: string, data: Partial<TenantsDocument>) {
    try {
      return await this.Tenant.findOneAndUpdate({ _id }, data, {
        returnOriginal: false,
      });
    } catch (error) {
      const err = createHttpError(500, "Error while deleting tenant");
      throw err;
    }
  }
}
