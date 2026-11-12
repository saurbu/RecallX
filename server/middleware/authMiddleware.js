
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Please login to continue"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User account no longer exists"
            });
        }

        req.user = user;
        req.userId = user._id;

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired session. Please login again."
        });
    }
};
