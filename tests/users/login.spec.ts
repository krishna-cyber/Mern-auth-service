import app from "../../src/app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { User } from "../../src/entity/User";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { RefreshToken } from "../../src/entity/RefreshToken";
dotenv.config({
  path: ".env.test.local",
});

describe("POST /auth/login", () => {
  //get connection from the data source
  //before all test cases this function will rul
  beforeAll(async () => {
    await connectToDatabase();
    mongoose.modelNames().map(async (model) => {
      await mongoose.models[model].deleteMany({});
    });
    // await User.deleteMany({}); //clean up the database
    // await RefreshToken.deleteMany({}); //clean up the database
  });

  afterEach(async () => {
    //clean up the database database truncate
    await User.deleteMany({});
    await RefreshToken.deleteMany({});
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("should return 200 statusCode correct email,password Given ", async () => {
      //AAA Pattern (Arrange, Act, Assert)
      //register user
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      //@ts-ignore
      await request(app).post("/auth/register").send(userData);

      // Act
      //@ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: userData.email, password: userData.password });

      // Assert

      expect(response.statusCode).toBe(200);
    });

    it("should return 400 statusCode for incorrect  email or password Given and message INVALID EMAIL OR PASSWORD ", async () => {
      //AAA Pattern (Arrange, Act, Assert)
      //register user
      const userData = {
        firstName: "Krishna",
        lastName: "Tiwari",
        email: "tiwarikrishna54321@gmail.com",
        password: "123456",
      };

      //@ts-ignore
      await request(app).post("/auth/register").send(userData);

      // Act
      //@ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: "wrongemail@gmail.com", password: userData.password });

      // Assert

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toBe("Invalid email or password");
    });

    it.todo(
      "should return error if extra field except email or password is given"
    );

    it.todo(
      "should return accessToken and refreshToken after login with valid email and password"
    );

    describe("if fields are not properly formatted", () => {});
  });
  describe("missing fields", () => {});
});
