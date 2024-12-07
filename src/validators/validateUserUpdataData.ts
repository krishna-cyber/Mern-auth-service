import { checkExact, checkSchema } from "express-validator";

export default checkExact(
  checkSchema({
    id: {
      in: ["params"],
      isMongoId: {
        errorMessage: "Id must be a valid mongoId",
      },
      exists: true,
    },
    firstName: {
      in: ["body"],
      optional: true,
      isString: {
        errorMessage: "Firstname must be in string",
      },
      exists: true,
    },
    lastName: {
      in: ["body"],
      optional: true,
      isString: {
        errorMessage: "Lastname must be in string",
      },
      exists: true,
    },
    role: {
      in: ["body"],
      optional: true,
      isString: {
        errorMessage: "Role must be in string",
      },
      exists: true,
    },
    email: {
      in: ["body"],
      optional: true,
      isEmail: {
        errorMessage: "Email must be valid",
      },
      exists: true,
    },
  })
);
