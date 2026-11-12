
import express from "express";

import { protect } from "../middleware/authMiddleware.js";

import {
    createCard,
    getCards,
    updateCard,
    deleteCard
} from "../controllers/cardController.js";

const router = express.Router();

router.use(protect);

router.route("/")
    .post(createCard)
    .get(getCards);

router.route("/:id")
    .put(updateCard)
    .delete(deleteCard);

export default router;
