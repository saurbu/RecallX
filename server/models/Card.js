
import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
    {
        front: {
            type: String,
            required: [true, "Card front is required"],
            trim: true,
            minlength: 1,
            maxlength: 2000
        },

        back: {
            type: String,
            required: [true, "Card back is required"],
            trim: true,
            minlength: 1,
            maxlength: 5000
        },

        deck: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Deck",
            required: true,
            index: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        // SM-2 scheduling fields
        easeFactor: {
            type: Number,
            default: 2.5,
            min: 1.3
        },

        interval: {
            type: Number,
            default: 0,
            min: 0
        },

        repetitions: {
            type: Number,
            default: 0,
            min: 0
        },

        dueDate: {
            type: Date,
            default: Date.now,
            index: true
        },

        lastReviewedAt: {
            type: Date,
            default: null
        },

        isNewCard: {
            type: Boolean,
            default: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

cardSchema.index({ user: 1, dueDate: 1 });

const Card = mongoose.model("Card", cardSchema);

export default Card;
