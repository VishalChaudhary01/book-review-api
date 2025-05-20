/* eslint-disable @typescript-eslint/no-explicit-any */
import { ZodError } from "zod";
import { ErrorRequestHandler } from "express";
import { AppError } from "@/errors/app.error";
import { StatusCode } from "@/config/http.config";
import { formatZodError } from "@/utils/format-zod-error";
import { getErrorMessage } from "@/utils/get-error-message";

export const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  _next,
): any => {
  console.error(`Error occured on PATH: ${req.path}`);
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errorCode: error.errorCode,
    });
  }

  if (error instanceof ZodError) {
    formatZodError(res, error);
    return;
  }

  if (error instanceof SyntaxError) {
    res.status(StatusCode.BAD_REQUEST).json({
      message: "Invalid JSON format. Please check your request body.",
    });
    return;
  }

  res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
    message: "Internal Server Error",
    error: getErrorMessage(error) || "Unknown error occured",
  });
  return;
};
