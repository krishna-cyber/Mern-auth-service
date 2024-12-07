import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Model } from "mongoose";
import { UserDocument } from "../entity/User";

class CredentialService {
  constructor(private User: Model<UserDocument>) {}
  async checkForPasswordMatch(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(String(password), hashedPassword);
  }
}

export default CredentialService;
