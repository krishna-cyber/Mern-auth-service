import { NextFunction, Response } from "express";
import { AuthRequest } from "../types/types";
import createHttpError from "http-errors";

export default function canAccess(roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { role } = req.auth;

      if (!roles.includes(role)) {
        const err = createHttpError(
          403,
          "You do not have permission to access this resource"
        );
        next(err);
      }
      next();
    } catch (error) {
      next(error);
      return;
    }
  };
}
