import { Router } from "express";
import authRoutes from "./auth.route";
import bookRoutes from "./book.route";

const v1Routes = Router();

v1Routes.use("/auth", authRoutes);
v1Routes.use("/books", bookRoutes);

export default v1Routes;
