import jwt from "jsonwebtoken";
import { config } from "@/config/env.config";

type Unit = "s" | "m" | "h" | "d";
type StringValues = `${number}${Unit}`;

type TokenPayload = {
  userId: string;
};

export const signJwt = (payload: TokenPayload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN as StringValues,
  });
};

export const verifyJwt = <TPayload extends object = TokenPayload>(
  token: string,
  secret: string = config.JWT_SECRET,
) => {
  try {
    const payload = jwt.verify(token, secret) as TPayload;
    return { payload };
  } catch (err: any) {
    return {
      error: err.message,
    };
  }
};
