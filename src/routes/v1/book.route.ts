import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  updateBook,
} from "@/controllers/book.controller";
import { Router } from "express";

const bookRoutes = Router();

bookRoutes.post("/", createBook);
bookRoutes.put("/:id", updateBook);
bookRoutes.delete("/:id", deleteBook);

bookRoutes.get("/", getAllBooks);
bookRoutes.get("/:id", getBookById);

export default bookRoutes;
