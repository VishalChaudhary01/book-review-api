import { Router } from "express";
import authRoutes from "./auth.route";
import bookRoutes from "./book.route";
import reviewRoutes from "./review.route";
import { authRequire } from "@/middlewares/auth-require.middleware";

const v1Routes = Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/books", bookRoutes);
v1Routes.use("/reviews", authRequire, reviewRoutes);

export default v1Routes;
