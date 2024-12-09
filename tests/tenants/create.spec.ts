import app from "../../src/app";
import { Tenants } from "../../src/entity/Tenants";
import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../../src/entity/User";
import { RefreshToken } from "../../src/entity/RefreshToken";
import { UserData } from "../../src/types/types";
import { ROLES } from "../../src/constants/constants";
dotenv.config({
  path: ".env.test.local",
});

describe("POST /tenants", () => {
  const validUserData: UserData = {
    firstName: "Krishna",
    lastName: "Tiwari",
    email: "tiwarikrishna54321@gmail.com",
    password: "password",
    role: "admin",
  };

  let accessToken: string;
  let refreshToken: string;

  beforeAll(async () => {
    await connectToDatabase();

    await User.deleteMany({}); //clean up the database
    await RefreshToken.deleteMany({}); //clean up the database
    await Tenants.deleteMany({}); //clean up the database
    //@ts-ignore
    await request(app).post("/auth/register").send(validUserData);
    // @ts-ignore
    const response = await request(app)
      .post("/auth/login")
      .send({ email: validUserData.email, password: validUserData.password });
    // extract accessToken and refreshToken
    const cookies: string[] = response.headers[
      "set-cookie"
    ] as unknown as string[];
    const accessTokenCookie = cookies.find((cookie: string) =>
      cookie.includes("accessToken")
    );
    const refreshTokenCookie = cookies.find((cookie: string) =>
      cookie.includes("refreshToken")
    );
    accessToken = accessTokenCookie.split("=")[1].split(";")[0];
    refreshToken = refreshTokenCookie.split("=")[1].split(";")[0];
    //then inject accessToken to every request
  });

  beforeEach(async () => {
    await Tenants.deleteMany({});
  });

  afterAll(async () => {
    await Tenants.deleteMany({});
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("it should return 201 status code", async () => {
      const tenantData = {
        name: "tenant1",
        address: "address1",
      };

      //@ts-ignore
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData);

      expect(response.statusCode).toBe(201);
    });
    it("it should persist tenant information in the database and return the tenant information", async () => {
      const tenantData = {
        name: "tenant1",
        address: "address1",
      };

      //@ts-ignore
      const response = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData);

      const tenant = await Tenants.find({});

      expect(response.body).toHaveProperty("result.name", tenantData.name);

      expect(response.body).toHaveProperty(
        "result.address",
        tenantData.address
      );

      expect(tenant).toHaveLength(1);
    });
    it("should return 401 status code and not allowed to create tenant if the user is not authenticated Token not provided", async () => {
      const tenantData = {
        name: "tenant1",
        address: "address1",
      };

      // @ts-ignore
      const response = await request(app).post("/tenants").send(tenantData);

      expect(response.statusCode).toBe(401);
    });
    it(
      "it should return 400 status code if the tenant name is already exist in the database"
    );
    it("should return 403 status code if the user is not admin", async () => {
      const userData: UserData = {
        firstName: "testdata1",
        lastName: "testdata2",
        email: "test1@gmail.com",
        password: "password",
        role: ROLES.CUSTOMER,
      };

      //@ts-ignore
      await request(app).post("/auth/register").send(userData);
      // @ts-ignore
      const response = await request(app)
        .post("/auth/login")
        .send({ email: userData.email, password: userData.password });
      // extract accessToken and refreshToken
      const cookies: string[] = response.headers[
        "set-cookie"
      ] as unknown as string[];
      const accessTokenCookie = cookies.find((cookie: string) =>
        cookie.includes("accessToken")
      );
      const refreshTokenCookie = cookies.find((cookie: string) =>
        cookie.includes("refreshToken")
      );
      accessToken = accessTokenCookie.split("=")[1].split(";")[0];
      refreshToken = refreshTokenCookie.split("=")[1].split(";")[0];

      const tenantData = {
        name: "tenant1",
        address: "address1",
      };

      //@ts-ignore
      const response1 = await request(app)
        .post("/tenants")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send(tenantData);

      expect(response1.statusCode).toBe(403);
    });
  });

  describe("given missing fields", () => {
    it("should return 400 status code if any field is missing");
  });
});
