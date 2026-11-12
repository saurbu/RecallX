
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

import {
    submitReview,
    getReviewHistory,
    getTodayQueue
} from "../controllers/reviewController.js";

const router = express.Router();

router.use(protect);

router.post("/", submitReview);
router.get("/history", getReviewHistory);
router.get("/today", getTodayQueue);

export default router;
