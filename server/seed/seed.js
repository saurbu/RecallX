import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "../config/db.js";
import User from "../models/User.js";
import Deck from "../models/Deck.js";
import Card from "../models/Card.js";

dotenv.config();

const seedDemoData = async () => {
    try {
        await connectDB();

        // Create or find demo user
        let user = await User.findOne({ email: "demo@recallx.app" });

        if (!user) {
            user = await User.create({
                name: "RecallX Demo",
                email: "demo@recallx.app",
                password: "RecallXDemo123",
                timezone: "Asia/Kolkata",
                dailyNewCardLimit: 20
            });
        }

        // Create demo decks if they don't exist
        const deckData = [
            {
                title: "JavaScript Fundamentals",
                description: "Core JavaScript concepts and interview preparation."
            },
            {
                title: "React Essentials",
                description: "Important React concepts, hooks, and patterns."
            },
            {
                title: "Data Structures & Algorithms",
                description: "Fundamental DSA concepts and problem-solving."
            }
        ];

        for (const data of deckData) {
            let deck = await Deck.findOne({
                user: user._id,
                title: data.title
            });

            if (!deck) {
                deck = await Deck.create({
                    ...data,
                    user: user._id
                });
            }

            const existingCards = await Card.countDocuments({
                user: user._id,
                deck: deck._id
            });

            if (existingCards === 0) {
                let cards = [];

                if (data.title === "JavaScript Fundamentals") {
                    cards = [
                        {
                            front: "What is JavaScript?",
                            back: "JavaScript is a high-level programming language used to create dynamic and interactive web applications."
                        },
                        {
                            front: "What is the difference between let, const, and var?",
                            back: "- var: function-scoped and can be redeclared.\n- let: block-scoped and can be reassigned.\n- const: block-scoped and cannot be reassigned."
                        },
                        {
                            front: "What is a closure in JavaScript?",
                            back: "A closure is a function that remembers and can access variables from its outer lexical scope, even after the outer function has finished executing."
                        },
                        {
                            front: "What is the difference between == and ===?",
                            back: "== compares values after type coercion, while === compares both value and type without type coercion."
                        }
                    ];
                }

                if (data.title === "React Essentials") {
                    cards = [
                        {
                            front: "What is React?",
                            back: "React is a JavaScript library for building component-based user interfaces."
                        },
                        {
                            front: "What is useState?",
                            back: "useState is a React Hook that lets functional components store and update state."
                        },
                        {
                            front: "What is useEffect?",
                            back: "useEffect is a React Hook used to synchronize a component with external systems and handle side effects."
                        },
                        {
                            front: "What are React props?",
                            back: "Props are read-only values passed from a parent component to a child component."
                        }
                    ];
                }

                if (data.title === "Data Structures & Algorithms") {
                    cards = [
                        {
                            front: "What is a stack?",
                            back: "A stack is a linear data structure that follows LIFO: Last In, First Out."
                        },
                        {
                            front: "What is a queue?",
                            back: "A queue is a linear data structure that follows FIFO: First In, First Out."
                        },
                        {
                            front: "What is binary search?",
                            back: "Binary search finds an element in a sorted array by repeatedly dividing the search interval in half. Its time complexity is O(log n)."
                        },
                        {
                            front: "What is the time complexity of linear search?",
                            back: "O(n), because in the worst case every element may need to be checked."
                        }
                    ];
                }

                await Card.insertMany(
                    cards.map((card) => ({
                        ...card,
                        user: user._id,
                        deck: deck._id,
                        isNewCard: true
                    }))
                );
            }
        }

        console.log("RecallX demo data seeded successfully!");
        console.log("Demo email: demo@recallx.app");
        console.log("Demo password: RecallXDemo123");
    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

seedDemoData();