import { ErrorCodeType } from "@/enums/error-code.enum";
import { StatusCodeType } from "@/config/http.config";

export class AppError extends Error {
  public statusCode: StatusCodeType;
  public errorCode?: ErrorCodeType;

  constructor(
    message: string,
    statusCode: StatusCodeType,
    errorCode?: ErrorCodeType,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
