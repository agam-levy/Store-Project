import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      errorMessage: err.message,
      details: err.details,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({ errorMessage: err.message });
  }

  return res.status(500).json({ errorMessage: "Unknown error" });
};
