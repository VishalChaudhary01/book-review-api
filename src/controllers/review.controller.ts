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
import { getUserIdService } from "./book.controller";
import { ErrorCode } from "@/enums/error-code.enum";

export const createReview = async (req: Request, res: Response) => {
  const userId = await getUserIdService(req.user?.id);
  const bookId = req.params.id;

  const data = createReviewSchema.parse(req.body);

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    throw new NotFoundError("Book Not found", ErrorCode.BOOK_NOT_FOUND);
  }

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
  const userId = await getUserIdService(req.user?.id);
  const reviewId = req.params.id;

  const data = updateReviewSchema.parse(req.body);

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new NotFoundError("Review not found", ErrorCode.REVIEW_NOT_FOUND);
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
  const userId = await getUserIdService(req.user?.id);
  const reviewId = req.params.id;

  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!existingReview) {
    throw new NotFoundError("Review not found", ErrorCode.REVIEW_NOT_FOUND);
  }

  if (existingReview.userId !== userId) {
    throw new UnauthorizedError("You are not authorized to delete this review");
  }

  await prisma.review.delete({ where: { id: reviewId } });

  res.status(StatusCode.OK).json({
    message: "Review deleted successfully",
  });
};
