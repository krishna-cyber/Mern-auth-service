import app from "../../src/app";

import request from "supertest";
import { closeDatabaseConnection, connectToDatabase } from "../utils/testUtils";
import { User } from "../../src/entity/User";
import dotenv from "dotenv";
import { UserData } from "../../src/types/types";

dotenv.config({
  path: ".env.test.local",
});

describe("GET /auth/self", () => {
  const validUserData: UserData = {
    firstName: "Krishna",
    lastName: "Tiwari",
    email: "tiwarikrishna54321@gmail.com",
    password: "password",
  };

  let accessToken: string;
  // let refreshToken: string;
  beforeAll(async () => {
    //database connnect
    await connectToDatabase();

    await User.deleteMany({});
    //create a user through userdata
    //@ts-ignore
    await request(app).post("/auth/register").send(validUserData);
    //login the user and
    //@ts-ignore
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
    // refreshToken = refreshTokenCookie.split("=")[1].split(";")[0];
  });

  afterAll(async () => {
    await closeDatabaseConnection();
    //delete all the users
    User.deleteMany({});
  });

  describe("given all fields", () => {
    it("should return 200 status code", async () => {
      //@ts-ignore
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`])
        .send();

      expect(response.statusCode).toBe(200);
    });

    it("should return user data", async () => {
      //@ts-ignore
      const userSelf = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=${accessToken}`]);
      //assert
      expect(userSelf.body.result.email).toBe(validUserData.email);
    });

    it("should return 401 status code if accessToken is not provided", async () => {
      // @ts-ignore
      const response = await request(app).get("/auth/self").send();
      expect(response.statusCode).toBe(401);
    });
    it("should return 401 status code if accessToken is invalid or expired", async () => {
      // @ts-ignore
      const response = await request(app)
        .get("/auth/self")
        .set("Cookie", [`accessToken=invalid`]);

      expect(response.statusCode).toBe(401);
    });
  });
});
