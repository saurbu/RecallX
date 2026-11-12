
import Card from "../models/Card.js";
import Deck from "../models/Deck.js";

export const createCard = async (req, res) => {
    try {
        const { front, back, deckId } = req.body;

        if (
            typeof front !== "string" ||
            typeof back !== "string" ||
            typeof deckId !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Front, back and deck ID are required"
            });
        }

        if (!/^[a-f\d]{24}$/i.test(deckId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deck ID"
            });
        }

        if (!front.trim() || front.trim().length > 2000) {
            return res.status(400).json({
                success: false,
                message: "Card front is required and must be under 2000 characters"
            });
        }

        if (!back.trim() || back.trim().length > 5000) {
            return res.status(400).json({
                success: false,
                message: "Card back is required and must be under 5000 characters"
            });
        }

        const deck = await Deck.findOne({
            _id: deckId,
            user: req.userId
        });

        if (!deck) {
            return res.status(404).json({
                success: false,
                message: "Deck not found"
            });
        }

        const card = await Card.create({
            front: front.trim(),
            back: back.trim(),
            deck: deck._id,
            user: req.userId
        });

        return res.status(201).json({
            success: true,
            message: "Flashcard created successfully",
            card
        });
    } catch (error) {
        console.error("Create card:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create flashcard"
        });
    }
};

export const getCards = async (req, res) => {
    try {
        const { deckId } = req.query;

        if (deckId !== undefined && (
            typeof deckId !== "string" ||
            !/^[a-f\d]{24}$/i.test(deckId)
        )) {
            return res.status(400).json({
                success: false,
                message: "Invalid deck ID"
            });
        }

        const filter = { user: req.userId };

        if (deckId) {
            const deck = await Deck.findOne({
                _id: deckId,
                user: req.userId
            });

            if (!deck) {
                return res.status(404).json({
                    success: false,
                    message: "Deck not found"
                });
            }

            filter.deck = deck._id;
        }

        const cards = await Card.find(filter)
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: cards.length,
            cards
        });
    } catch (error) {
        console.error("Get cards:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch flashcards"
        });
    }
};

export const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { front, back } = req.body;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid card ID"
            });
        }

        const updates = {};

        if (front !== undefined) {
            if (
                typeof front !== "string" ||
                !front.trim() ||
                front.trim().length > 2000
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Card front must contain 1–2000 characters"
                });
            }

            updates.front = front.trim();
        }

        if (back !== undefined) {
            if (
                typeof back !== "string" ||
                !back.trim() ||
                back.trim().length > 5000
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Card back must contain 1–5000 characters"
                });
            }

            updates.back = back.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide front or back to update"
            });
        }

        const card = await Card.findOneAndUpdate(
            { _id: id, user: req.userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Flashcard not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Flashcard updated successfully",
            card
        });
    } catch (error) {
        console.error("Update card:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update flashcard"
        });
    }
};

export const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid card ID"
            });
        }

        const card = await Card.findOneAndDelete({
            _id: id,
            user: req.userId
        });

        if (!card) {
            return res.status(404).json({
                success: false,
                message: "Flashcard not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Flashcard deleted successfully"
        });
    } catch (error) {
        console.error("Delete card:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete flashcard"
        });
    }
};
