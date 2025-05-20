import { Router } from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "@/controllers/book.controller";
import { authRequire } from "@/middlewares/auth-require.middleware";
import { createReview } from "@/controllers/review.controller";

const bookRoutes = Router();

bookRoutes.post("/", authRequire, createBook);
bookRoutes.put("/:id", authRequire, updateBook);
bookRoutes.delete("/:id", authRequire, deleteBook);

bookRoutes.get("/", getAllBooks);
bookRoutes.get("/:id", getBookById);

// Add review to a book
bookRoutes.post("/:id/reviews", authRequire, createReview);

export default bookRoutes;
