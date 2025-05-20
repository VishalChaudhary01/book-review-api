import { Router } from "express";
import { deleteReview, updateReview } from "@/controllers/review.controller";

const reviewRoutes = Router();

reviewRoutes.put("/:id", updateReview);
reviewRoutes.delete("/:id", deleteReview);

export default reviewRoutes;
