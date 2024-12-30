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

  async getTenantsLists() {
    try {
      return await this.Tenant.find({});
    } catch (error) {
      const err = createHttpError(500, "Error while fetching tenants");
      throw err;
    }
  }

  async getTenants(
    currentPage: number,
    pageSize: number,
    searchString: string = ""
  ) {
    const results = await this.Tenant.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: `^.*${searchString}.*$`, $options: "i" } },
            {
              address: { $regex: `^.*${searchString}.*$`, $options: "i" },
            },
          ],
        },
      },

      {
        $facet: {
          data: [
            {
              $skip: (currentPage - 1) * pageSize,
            },
            {
              $limit: pageSize,
            },
          ],

          totalCount: [
            {
              $count: "count",
            },
          ],
        },
      },
    ]);

    const response = {
      tenants: results[0]?.data || [],
      totalDocuments: results[0]?.totalCount[0]?.count || 0,
    };

    return response;
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
