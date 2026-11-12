
import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";

dotenv.config();

const startServer = async () => {
    if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
        console.error("Missing required environment variables");
        process.exit(1);
    }

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer(); 
