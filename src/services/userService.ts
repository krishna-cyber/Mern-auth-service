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

  async getUserLists() {
    return await this.User.find({});
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
