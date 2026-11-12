
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },
        card: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Card",
            required: true
        },
        deck: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deck",
            required: true
        },
        rating: {
            type: String,
            enum: ["Again", "Hard", "Good", "Easy"],
            required: true
        },
        wasNew: {
            type: Boolean,
            default: false
        },
        interval: {
            type: Number,
            required: true
        },
        easeFactor: {
            type: Number,
            required: true
        },
        reviewedAt: {
            type: Date,
            default: Date.now,
            required: true
        },
        nextReviewAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
);

reviewSchema.index({ user: 1, reviewedAt: -1 });
reviewSchema.index({ user: 1, card: 1, reviewedAt: -1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
