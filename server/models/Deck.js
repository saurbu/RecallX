
import mongoose from "mongoose";

const deckSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Deck title is required"],
            trim: true,
            minlength: 2,
            maxlength: 80
        },

        description: {
            type: String,
            trim: true,
            maxlength: 300,
            default: ""
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        }
    },
    {
        timestamps: true
    }
);

const Deck = mongoose.model("Deck", deckSchema);

export default Deck;
