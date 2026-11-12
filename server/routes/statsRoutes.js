
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDashboardStats } from "../controllers/statsController.js";

const router = express.Router();

router.use(protect);

router.get("/dashboard", getDashboardStats);

export default router;
