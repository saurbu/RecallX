
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const generateToken = (userId) => {
    return jwt.sign(
        { id: userId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

const setTokenCookie = (res, token) => {
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: COOKIE_MAX_AGE
    });
};

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, timezone } = req.body;

        if (
            typeof name !== "string" ||
            typeof email !== "string" ||
            typeof password !== "string"
        ) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.trim().toLowerCase();

        if (cleanName.length < 2 || cleanName.length > 50) {
            return res.status(400).json({
                success: false,
                message: "Name must contain 2–50 characters"
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        if (password.length < 8 || password.length > 72) {
            return res.status(400).json({
                success: false,
                message: "Password must contain 8–72 characters"
            });
        }

        if (timezone !== undefined) {
            if (typeof timezone !== "string" || timezone.length > 100) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid timezone"
                });
            }

            try {
                Intl.DateTimeFormat("en-US", { timeZone: timezone });
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid timezone"
                });
            }
        }

        const existingUser = await User.findOne({ email: cleanEmail });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        const user = await User.create({
            name: cleanName,
            email: cleanEmail,
            password,
            timezone: timezone || "Asia/Kolkata"
        });

        const token = generateToken(user._id);
        setTokenCookie(res, token);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                timezone: user.timezone,
                dailyNewCardLimit: user.dailyNewCardLimit
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists"
            });
        }

        if (error.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: error.message
            });
        }

        console.error("Register error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create account. Please try again."
        });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const cleanEmail = email.trim().toLowerCase();

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address"
            });
        }

        const user = await User.findOne({ email: cleanEmail })
            .select("+password");

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user._id);
        setTokenCookie(res, token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                timezone: user.timezone,
                dailyNewCardLimit: user.dailyNewCardLimit
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to login. Please try again."
        });
    }
};

// LOGOUT
export const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    });

    return res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};

// GET LOGGED-IN USER
export const getMe = async (req, res) => {
    return res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            timezone: req.user.timezone,
            dailyNewCardLimit: req.user.dailyNewCardLimit
        }
    });
};
