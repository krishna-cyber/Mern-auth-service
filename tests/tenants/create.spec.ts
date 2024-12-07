import app from "../../src/app";
import { Tenants } from "../../src/entity/Tenants";
import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: ".env.test.local",
});

describe("POST /tenants", () => {
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

  beforeEach(async () => {
    await Tenants.deleteMany({});
  });

  afterAll(async () => {
    Tenants.deleteMany({});
    await closeDatabaseConnection();
  });

  describe("given all fields", () => {
    it("it should return 201 status code", async () => {
      const tenantData = {
        name: "tenant1",
        address: "address1",
      };

      //@ts-ignore
      const response = await request(app).post("/tenants").send(tenantData);
      expect(response.statusCode).toBe(201);
    });
    it("it should persist tenant information in the database and return the tenant information", async () => {
      const tenantData = {
        name: "tenant1",
        address: "address1",
      };

      //@ts-ignore
      const response = await request(app).post("/tenants").send(tenantData);

      expect(response.body).toHaveProperty("result.name", tenantData.name);

      expect(response.body).toHaveProperty(
        "result.address",
        tenantData.address
      );
    });
    it.todo(
      "it should return 400 status code if the tenant name is already exist in the database"
    );
  });
});
