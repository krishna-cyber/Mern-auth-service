import { checkExact, checkSchema } from "express-validator";

export default checkExact(
  checkSchema({
    name: {
      isString: {
        errorMessage: "Name must be a string",
      },
    },
    address: {
      isString: {
        errorMessage: "Address must be a string",
      },
    },
  })
);
