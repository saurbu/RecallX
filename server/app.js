
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import deckRoutes from "./routes/deckRoutes.js";
import cardRoutes from "./routes/cardRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}));

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "RecallX API is running 🚀"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/decks", deckRoutes);
app.use("/api/cards", cardRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/stats", statsRoutes);

export default app;
