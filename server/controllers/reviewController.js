
import mongoose from "mongoose";
import Card from "../models/Card.js";
import Review from "../models/Review.js";
import { calculateNextReview } from "../utils/sm2.js";
import { getZonedDayRange } from "../utils/dateUtils.js";

const validRatings = ["Again", "Hard", "Good", "Easy"];

export const submitReview = async (req, res) => {
    try {
        const { cardId, rating } = req.body || {};

        if (!cardId || !rating) {
            return res.status(400).json({
                success: false,
                message: "Card ID and rating are required"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(cardId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid card ID"
            });
        }

        if (!validRatings.includes(rating)) {
            return res.status(400).json({
                success: false,
                message: "Rating must be Again, Hard, Good, or Easy"
            });
        }

        const card = await Card.findOne({
            _id: cardId,
            user: req.userId
        });

        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Card not found"
            });
        }

        const reviewedAt = new Date();
        const wasNew = card.isNewCard;

        const result = calculateNextReview(
            card,
            rating,
            reviewedAt
        );

        card.repetitions = result.repetitions;
        card.interval = result.interval;
        card.easeFactor = result.easeFactor;
        card.dueDate = result.dueDate;
        card.lastReviewedAt = reviewedAt;
        card.isNewCard = false;

        await card.save();

        const review = await Review.create({
            user: req.userId,
            card: card._id,
            deck: card.deck,
            rating,
            wasNew,
            interval: result.interval,
            easeFactor: result.easeFactor,
            reviewedAt,
            nextReviewAt: result.dueDate
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully",
            review,
            card: {
                _id: card._id,
                front: card.front,
                back: card.back,
                interval: card.interval,
                repetitions: card.repetitions,
                easeFactor: card.easeFactor,
                dueDate: card.dueDate,
                isNewCard: card.isNewCard
            }
        });
    } catch (error) {
        console.error("Submit review error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit review"
        });
    }
};

export const getReviewHistory = async (req, res) => {
    try {
        const reviews = await Review.find({
            user: req.userId
        })
            .populate("card", "front back")
            .populate("deck", "title")
            .sort({ reviewedAt: -1 })
            .limit(100);

        return res.status(200).json({
            success: true,
            count: reviews.length,
            reviews
        });
    } catch (error) {
        console.error("Review history error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch review history"
        });
    }
};



export const getTodayQueue = async (req, res) => {
    try {
        const user = req.user;
        const now = new Date();

        const { start, end } = getZonedDayRange(
            user.timezone || "Asia/Kolkata",
            now
        );

        // Count new cards already studied today.
        const newCardsStudied = await Review.countDocuments({
            user: req.userId,
            wasNew: true,
            reviewedAt: {
                $gte: start,
                $lte: end
            }
        });

        // Calculate remaining new-card allowance.
        const dailyLimit = user.dailyNewCardLimit ?? 20;

        const remainingNewCards = Math.max(
            0,
            dailyLimit - newCardsStudied
        );

        // Fetch due and overdue cards across all decks.
        const dueCards = await Card.find({
            user: req.userId,
            isNewCard: false,
            dueDate: { $lte: end }
        })
            .populate("deck", "title")
            .sort({ dueDate: 1 });

        // Fetch new cards within the daily limit.
        const newCards = await Card.find({
            user: req.userId,
            isNewCard: true
        })
            .populate("deck", "title")
            .sort({ createdAt: 1 })
            .limit(remainingNewCards);

        return res.status(200).json({
            success: true,
            date: start.toISOString(),
            timezone: user.timezone || "Asia/Kolkata",
            summary: {
                dueCount: dueCards.length,
                newCardsStudied,
                dailyNewCardLimit: dailyLimit,
                remainingNewCards,
                newCardsAvailable: newCards.length,
                totalQueue: dueCards.length + newCards.length
            },
            dueCards,
            newCards
        });
    } catch (error) {
        console.error("Daily queue error:", error);

        return res.status(400).json({
            success: false,
            message: "Unable to load today's review queue. Check your timezone settings."
        });
    }
};
