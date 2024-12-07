import logger from "../config/logger";
import { User } from "../entity/User";
import { AuthService } from "../services/authService";
import UserService from "../services/userService";
import { UserData } from "../types/types";

const userService = new UserService(User);

const authservice = new AuthService(userService, User, logger);
async function checkAndCreateAdmin() {
  const adminSeed: UserData = {
    firstName: "Krishna",
    lastName: "Tiwari",
    email: "tiwarikrishna54321@gmail.com",
    password: String(123456),
    role: "admin",
  };

  await authservice.checkForAdminExistanceAndRegister(adminSeed);
}

checkAndCreateAdmin();
