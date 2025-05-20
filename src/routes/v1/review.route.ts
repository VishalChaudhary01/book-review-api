import { Router } from "express";
import {
  createReview,
  deleteReview,
  updateReview,
} from "@/controllers/review.controller";

const reviewRoutes = Router();

reviewRoutes.post("/", createReview);
reviewRoutes.put("/:id", updateReview);
reviewRoutes.delete("/:id", deleteReview);

export default reviewRoutes;
