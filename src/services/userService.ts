import { UserData } from "../types/types";
import { UserDocument } from "../entity/User";
import createHttpError from "http-errors";
import { ROLES } from "../constants/constants";
import { Model } from "mongoose";

class UserService {
  constructor(private User: Model<UserDocument>) {}

  async create({ firstName, lastName, email, password, role }: UserData) {
    const user = new this.User({
      firstName,
      lastName,
      email,
      password,
      role: role ?? ROLES.CUSTOMER,
    });
    //check for user already exist or not in the database
    const existingUser = await this.User.findOne({ email });

    if (existingUser) {
      const err = createHttpError(400, "User already exists with this email");
      throw err;
    }
    return await user.save();
  }

  async findUserByEmail(email: string, allFields = false) {
    return allFields
      ? await this.User.findOne({ email }).select("+password")
      : await this.User.findOne({ email });
  }

  async findUserById(id: string) {
    return await this.User.findById(id);
  }

  async getUserLists(
    currentPage: number,
    pageSize: number,
    role: string,
    searchString: string = ""
  ) {
    let results;
    let response;
    if (role) {
      // mongodb aggregate
      results = await this.User.aggregate([
        {
          $match: {
            role: role,
          },
        },
        {
          $match: {
            $or: [
              { firstName: { $regex: `.*${searchString}.*`, $options: "i" } },
              {
                lastName: { $regex: `.*${searchString}.*`, $options: "i" },
              },
              {
                email: { $regex: `.*${searchString}.*`, $options: "i" },
              },
            ],
          },
        },
        {
          $facet: {
            data: [
              {
                $project: {
                  password: 0,
                },
              },
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

      response = {
        users: results[0]?.data || [],
        totalDocuments: results[0]?.totalCount[0]?.count || 0,
      };
      return response;
    }

    results = await this.User.aggregate([
      {
        $match: {
          $or: [
            { firstName: { $regex: `^.*${searchString}.*$`, $options: "i" } },
            {
              lastName: { $regex: `^.*${searchString}.*$`, $options: "i" },
            },
            {
              email: { $regex: `^.*${searchString}.*$`, $options: "i" },
            },
          ],
        },
      },

      {
        $facet: {
          data: [
            {
              $project: {
                password: 0,
              },
            },
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

    response = {
      users: results[0]?.data || [],
      totalDocuments: results[0]?.totalCount[0]?.count || 0,
    };

    return response;
  }

  async deleteUserById(_id: string) {
    return await this.User.deleteOne({ _id });
  }

  async updateUserById(_id: string, data: UserData) {
    return await this.User.findByIdAndUpdate(_id, data, {
      new: true,
    });
  }
}
export default UserService;
