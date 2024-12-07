import { checkSchema } from "express-validator";

export default checkSchema({
  email: {
    notEmpty: {
      errorMessage: "Email is required",
    },
    isEmail: {
      errorMessage: "Email should be a valid email address",
    },
    trim: true,
  },
  firstName: {
    notEmpty: {
      errorMessage: "First Name is required",
    },
    isString: {
      errorMessage: "First Name should be a string",
    },
    trim: true,
  },
  lastName: {
    notEmpty: {
      errorMessage: "Last Name is required",
    },
    isString: {
      errorMessage: "Last Name should be a string",
    },
    trim: true,
  },
  password: {
    notEmpty: {
      errorMessage: "Password is required",
    },
    // isStrongPassword: {
    //   errorMessage: "Password should be a strong password",
    // },
  },
});
