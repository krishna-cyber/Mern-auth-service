import app from "../../src/app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { User } from "../../src/entity/User";
import dotenv from "dotenv";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { UserData } from "../../src/types/types";
dotenv.config({
  path: ".env.test.local",
});

describe("POST /auth/login", () => {
  const validUserData: UserData = {
    firstName: "Krishna",
    lastName: "Tiwari",
    email: "tiwarikrishna54321@gmail.com",
    password: "password",
  };
  beforeAll(async () => {
    await connectToDatabase();
    await User.deleteMany({});
    await RefreshToken.deleteMany({});

    //create a user first for futher login test
    //@ts-ignore
    await request(app).post("/auth/register").send(validUserData);
  });

  afterAll(async () => {
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("should return 200 statusCode correct email,password Given ", async () => {
      //@ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: validUserData.email, password: validUserData.password });

      // Assert

      expect(response.statusCode).toBe(200);
    });

    it("should return 400 statusCode for incorrect  email or password Given and message INVALID EMAIL OR PASSWORD ", async () => {
      // Act
      //@ts-ignore
      const response = await request(app).post("/auth/login").send({
        email: "wrongemail@gmail.com",
        password: validUserData.password,
      });

      // Assert

      expect(response.statusCode).toBe(400);
      expect(response.body.errors[0].msg).toBe("Invalid email or password");
    });

    it("should return error if extra field except email or password is given", async () => {
      // @ts-ignore
      const response = await request(app).post("/auth/login").send({
        email: validUserData.email,
        password: validUserData.password,
        extraField: "extraField",
      });

      expect(response.statusCode).toBe(400);
    });

    it("should return accessToken and refreshToken after login with valid email and password", async () => {
      // @ts-ignore
      const response = await request(app).post("/auth/login").send({
        email: validUserData.email,
        password: validUserData.password,
      });

      const cookies: string[] = response.headers[
        "set-cookie"
      ] as unknown as string[];
      const accessTokenCookie = cookies.find((cookie: string) =>
        cookie.includes("accessToken")
      );
      const refreshTokenCookie = cookies.find((cookie: string) =>
        cookie.includes("refreshToken")
      );
      const accessToken = accessTokenCookie.split("=")[1].split(";")[0];
      const refreshToken = refreshTokenCookie.split("=")[1].split(";")[0];

      expect(accessToken).toBeDefined();
      expect(refreshToken).toBeDefined();
    });
  });
  describe("missing fields", () => {});
});
