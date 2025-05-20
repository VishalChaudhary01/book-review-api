import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "@/config/prisma.config";
import { StatusCode } from "@/config/http.config";
import { NotFoundError } from "@/errors/not-found.error";
import { UnauthorizedError } from "@/errors/unauthorize.error";
import {
  createBookSchema,
  updateBookSchema,
} from "@/validators/book.validator";

export const createBook = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const data = createBookSchema.parse(req.body);

  const book = await prisma.book.create({
    data: {
      ...data,
      authorId: userId,
    },
  });

  res.status(StatusCode.CREATED).json({
    message: "Book created successfully",
    data: book,
  });
};

export const updateBook = async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError("Unauthorized");
  }

  const data = updateBookSchema.parse(req.body);

  const existingBook = await prisma.book.findUnique({ where: { id: bookId } });
  if (!existingBook) {
    throw new NotFoundError("Book not found");
  }
  if (existingBook.authorId !== userId) {
    throw new UnauthorizedError("Unauthorized to update this book");
  }

  const book = await prisma.book.update({
    where: { id: bookId },
    data: { ...data },
  });

  res.status(StatusCode.OK).json({
    message: "Book updated successfully",
    data: { book },
  });
};

export const deleteBook = async (req: Request, res: Response) => {
  const bookId = req.params.id;
  const userId = req.user?.id;
  if (!userId) {
    throw new UnauthorizedError("Unauthorize");
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });
  if (!book) {
    throw new NotFoundError("Book not found");
  }
  if (book.authorId !== userId) {
    throw new UnauthorizedError("Unauthorized to delete this book");
  }

  await prisma.book.delete({
    where: { id: bookId },
  });

  res.status(StatusCode.OK).json({
    message: "Book deleted successfully",
  });
};

export const getBookById = async (req: Request, res: Response) => {
  const bookId = req.params.id;

  const pageSize = parseInt(req.query.pageSize as string) || 5;
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;
  const skip = (pageNumber - 1) * pageSize;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  if (!book) {
    throw new NotFoundError("Book not found");
  }

  const [averageRatingResult, reviews, totalReviews] = await Promise.all([
    prisma.review.aggregate({
      where: { bookId },
      _avg: { rating: true },
    }),
    prisma.review.findMany({
      where: { bookId },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    }),
    prisma.review.count({ where: { bookId } }),
  ]);

  const averageRating = averageRatingResult._avg.rating || 0;
  const totalPages = Math.ceil(totalReviews / pageSize);

  res.status(StatusCode.OK).json({
    message: "Book fetched successfully",
    data: {
      book,
      averageRating,
      reviews,
      pagination: {
        pageSize,
        pageNumber,
        totalReviews,
        totalPages,
      },
    },
  });
};

export const getAllBooks = async (req: Request, res: Response) => {
  const filters = {
    author: req.query.author
      ? (req.query.author as string).split(",")
      : undefined,
    genre: req.query.genre ? (req.query.genre as string).split(",") : undefined,
    keyword: req.query.keyword as string | undefined,
  };

  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const pageNumber = parseInt(req.query.pageNumber as string) || 1;
  const skip = (pageNumber - 1) * pageSize;

  const where: Prisma.BookWhereInput = {
    ...(filters.author?.length && { authorId: { in: filters.author } }),
    ...(filters.genre?.length && { genre: { in: filters.genre } }),
    ...(filters.keyword && {
      OR: [
        { title: { contains: filters.keyword, mode: "insensitive" } },
        { description: { contains: filters.keyword, mode: "insensitive" } },
        {
          author: {
            name: { contains: filters.keyword, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  const [books, totalCount] = await Promise.all([
    prisma.book.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        description: true,
        genre: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    }),
    prisma.book.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  res.status(StatusCode.OK).json({
    message: "All books fetched successfully",
    data: {
      books,
      pagination: {
        pageSize,
        pageNumber,
        totalCount,
        totalPages,
        skip,
      },
    },
  });
};
