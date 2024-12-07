import { Model } from "mongoose";
import UserService from "./userService";
import { UserDocument } from "../entity/User";
import { Logger } from "winston";
import { UserData } from "../types/types";

export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly User: Model<UserDocument>,
    private readonly logger: Logger
  ) {}

  async checkForAdminExistanceAndRegister({
    firstName,
    lastName,
    email,
    password,
    role,
  }: UserData) {
    const isAdminExist = await this.User.findOne({ role: "admin" });

    if (isAdminExist) {
      this.logger.info("Admin already exists, Application running with admin");
      return;
    }

    const admin = await this.userService.create({
      firstName,
      lastName,
      email,
      password,
      role,
    });

    this.logger.info("Admin registered successfully", admin._id);
  }
}
