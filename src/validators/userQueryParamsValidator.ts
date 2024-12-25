import { checkSchema } from "express-validator";

export default checkSchema(
  {
    currentPage: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value);
          return isNaN(parsedValue) ? 1 : parsedValue;
        },
      },
    },
    pageSize: {
      customSanitizer: {
        options: (value) => {
          const parsedValue = Number(value);
          return isNaN(parsedValue) ? 10 : parsedValue;
        },
      },
    },
  },
  ["query"]
);
