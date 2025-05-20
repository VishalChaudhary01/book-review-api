import { StatusCode } from "@/config/http.config";
import prisma from "@/config/prisma.config";
import { BadRequestError } from "@/errors/bad-request.error";
import { NotFoundError } from "@/errors/not-found.error";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import {
  createReviewSchema,
  updateReviewSchema,
} from "@/validators/review.validator";
import { Request, Response } from "express";

export const createReview = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const bookId = req.params.id;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const data = createReviewSchema.parse(req.body);
  const existingReview = await prisma.review.findFirst({
    where: {
      bookId,
      userId,
    },
  });

  if (existingReview) {
    throw new BadRequestError("You have already reviewed this book");
  }

  const review = await prisma.review.create({
    data: {
      ...data,
      userId,
      bookId,
    },
  });

  res.status(StatusCode.CREATED).json({
    message: "Review submitted successfully",
    data: { review },
  });
};

export const updateReview = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const reviewId = req.params.id;

  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const data = updateReviewSchema.parse(req.body);

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new NotFoundError("Review not found");
  }

  if (existingReview.userId !== userId) {
    throw new UnauthorizedError("You are not authorized to update this review");
  }

  const updatedReview = await prisma.review.update({
    where: { id: reviewId },
    data,
  });

  res.status(StatusCode.OK).json({
    message: "Review updated successfully",
    data: { updatedReview },
  });
};

export const deleteReview = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const reviewId = req.params.id;

  if (!userId) throw new UnauthorizedError("Unauthorized");

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new NotFoundError("Review not found");
  }

  if (existingReview.userId !== userId) {
    throw new UnauthorizedError("You are not authorized to delete this review");
  }

  await prisma.review.delete({ where: { id: reviewId } });

  res.status(StatusCode.OK).json({
    message: "Review deleted successfully",
  });
};
