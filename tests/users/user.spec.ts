import app from "../../src/app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { ROLES } from "../../src/constants/constants";
import { User } from "../../src/entity/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
import createJWKSMock from "mock-jwks";

dotenv.config({
  path: ".env.test.local",
});

let jwks: ReturnType<typeof createJWKSMock>;

describe("GET /auth/self", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    //database connnect
    //create a user through userdata
    //login the user and
    // extract accessToken and refreshToken
  });

  // beforeEach(() => {
  //   jwks.start();
  // });

  // afterEach(async () => {
  //   //clean up the database database truncate
  //   await User.deleteMany({});
  //   jwks.stop(); //stop the mock server
  // });

  afterAll(async () => {
    //delete all the registered users
    //close the database connection

    await closeDatabaseConnection();
  });

  //valid user data for all test cases
  const userData = {
    email: "tiwarikrishna54321@gmail.com",
    password: "password",
    firstName: "Krishna",
    lastName: "Tiware",
  };
  describe("given all fields", () => {
    it("should return 200 status code", async () => {
      const accessToken = jwks.token({
        sub: "1",
        role: ROLES.CUSTOMER,
      });

      //@ts-ignore
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it("should return user data", async () => {
      //register a user
      //@ts-ignore
      const response = await request(app).post("/auth/register").send(userData);

      const accessToken = jwks.token({
        sub: String(response.body.result._id),
        role: response.body.role,
      });

      //@ts-ignore
      const userSelf = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`]);

      //assert
      expect(userSelf.body._id).toBe(response.body.result._id);
    });

    it.todo("should return 401 status code if accessToken is not provided");
    it.todo(
      "should return 401 status code if accessToken is invalid or expired"
    );

    it.todo("should clear the cookies if user is logged out");
  });

  it.todo(
    "should return new accessToken if refreshToken is provided and refresh the token also"
  );
});
