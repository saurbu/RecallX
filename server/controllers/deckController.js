
import Deck from "../models/Deck.js";
import Card from "../models/Card.js";

export const createDeck = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (typeof title !== "string" || !title.trim()) {
            return res.status(400).json({
                success: false,
                message: "Deck title is required"
            });
        }

        if (title.trim().length < 2 || title.trim().length > 80) {
            return res.status(400).json({
                success: false,
                message: "Deck title must contain 2–80 characters"
            });
        }

        if (
            description !== undefined &&
            (typeof description !== "string" || description.length > 300)
        ) {
            return res.status(400).json({
                success: false,
                message: "Description cannot exceed 300 characters"
            });
        }

        const deck = await Deck.create({
            title: title.trim(),
            description: description?.trim() || "",
            user: req.userId
        });

        return res.status(201).json({
            success: true,
            message: "Deck created successfully",
            deck
        });
    } catch (error) {
        console.error("Create deck:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create deck"
        });
    }
};

export const getDecks = async (req, res) => {
    try {
        const decks = await Deck.find({ user: req.userId })
            .sort({ createdAt: -1 })
            .lean();

        const deckIds = decks.map(deck => deck._id);

        const counts = await Card.aggregate([
            { $match: { user: req.user._id, deck: { $in: deckIds } } },
            {
                $group: {
                    _id: "$deck",
                    totalCards: { $sum: 1 },
                    newCards: {
                        $sum: { $cond: ["$isNewCard", 1, 0] }
                    }
                }
            }
        ]);

        const countMap = new Map(
            counts.map(item => [item._id.toString(), item])
        );

        const result = decks.map(deck => {
            const count = countMap.get(deck._id.toString());

            return {
                ...deck,
                totalCards: count?.totalCards || 0,
                newCards: count?.newCards || 0
            };
        });

        return res.status(200).json({
            success: true,
            count: result.length,
            decks: result
        });
    } catch (error) {
        console.error("Get decks:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch decks"
        });
    }
};

export const getDeckById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deck ID"
            });
        }

        const deck = await Deck.findOne({
            _id: id,
            user: req.userId
        });

        if (!deck) {
            return res.status(404).json({
                success: false,
                message: "Deck not found"
            });
        }

        const cards = await Card.find({
            deck: deck._id,
            user: req.userId
        }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            deck,
            cards
        });
    } catch (error) {
        console.error("Get deck:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch deck"
        });
    }
};

export const updateDeck = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deck ID"
            });
        }

        const updates = {};

        if (title !== undefined) {
            if (
                typeof title !== "string" ||
                title.trim().length < 2 ||
                title.trim().length > 80
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Deck title must contain 2–80 characters"
                });
            }

            updates.title = title.trim();
        }

        if (description !== undefined) {
            if (
                typeof description !== "string" ||
                description.length > 300
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Description must be under 300 characters"
                });
            }

            updates.description = description.trim();
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Provide at least one field to update"
            });
        }

        const deck = await Deck.findOneAndUpdate(
            { _id: id, user: req.userId },
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!deck) {
            return res.status(404).json({
                success: false,
                message: "Deck not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Deck updated successfully",
            deck
        });
    } catch (error) {
        console.error("Update deck:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to update deck"
        });
    }
};

export const deleteDeck = async (req, res) => {
    try {
        const { id } = req.params;

        if (!/^[a-f\d]{24}$/i.test(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid deck ID"
            });
        }

        const deck = await Deck.findOneAndDelete({
            _id: id,
            user: req.userId
        });

        if (!deck) {
            return res.status(404).json({
                success: false,
                message: "Deck not found"
            });
        }

        await Card.deleteMany({
            deck: deck._id,
            user: req.userId
        });

        return res.status(200).json({
            success: true,
            message: "Deck and its flashcards deleted successfully"
        });
    } catch (error) {
        console.error("Delete deck:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to delete deck"
        });
    }
};
