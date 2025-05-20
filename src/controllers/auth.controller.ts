import { Request, Response } from "express";
import prisma from "@/config/prisma.config";
import { StatusCode } from "@/config/http.config";
import { signJwt } from "@/utils/jwt";
import { signinSchema, signupSchema } from "@/validators/auth.validator";
import { BadRequestError } from "@/errors/bad-request.error";
import { compareValue, hashValue } from "@/utils/bcrypt";

export const signup = async (req: Request, res: Response) => {
  const data = signupSchema.parse(req.body);

  const isExist = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (isExist) {
    throw new BadRequestError("Email is already registered, Try to Login");
  }

  const hashedPassword = await hashValue(data.password);
  await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  res.status(StatusCode.CREATED).json({
    message: `User registered successfully, Now you can login`,
  });
};

export const signin = async (req: Request, res: Response) => {
  const data = signinSchema.parse(req.body);

  const user = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (!user || !(await compareValue(data.password, user.password))) {
    throw new BadRequestError("Invalid credentials");
  }

  const token = signJwt({ userId: user.id });

  res.status(StatusCode.OK).json({
    message: `User logged in successfully`,
    data: {
      token,
    },
  });
};
