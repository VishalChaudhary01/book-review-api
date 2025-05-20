import { ErrorCode } from "@/enums/error-code.enum";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import { verifyJwt } from "@/utils/jwt";
import { Request, Response, NextFunction } from "express";

export const authRequire = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      throw new UnauthorizedError(
        "Authentication token not found",
        ErrorCode.AUTH_TOKEN_NOT_FOUND,
      );

    const { payload, error } = verifyJwt(token);
    if (error || !payload) {
      throw new UnauthorizedError(
        "Invalid or expired authentication token",
        ErrorCode.AUTH_INVALID_TOKEN,
      );
    }

    req.user = { id: payload.userId };
    next();
  } catch (err) {
    next(err);
  }
};
