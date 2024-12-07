import { checkExact, checkSchema } from "express-validator";

export default checkExact(
  checkSchema({
    email: {
      notEmpty: {
        errorMessage: "Email is required",
      },
      isEmail: {
        errorMessage: "Email should be a valid email address",
      },
    },

    password: {
      notEmpty: {
        errorMessage: "Password is required",
      },
    },
  })
);
