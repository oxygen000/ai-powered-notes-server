"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// ✅ [1] - التحقق من المستخدم عبر التوكن
const authenticateUser = async (req, res, next) => {
    try {
        let token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ message: "Unauthorized: No token provided" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.default.findById(decoded.id).select("-password");
        if (!user) {
            res.status(401).json({ message: "Unauthorized: User not found" });
            return;
        }
        req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
        console.log(`✅ User authenticated: ${user.email}`);
        next();
    }
    catch (error) {
        console.error("❌ Authentication error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authenticateUser = authenticateUser;
// ✅ [2] - تسجيل دخول المستخدم
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({ message: "Invalid email or password" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
            algorithm: "HS256",
        });
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        console.log(`✅ User logged in: ${user.email}`);
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
            redirect: "/home",
        });
    }
    catch (error) {
        console.error("❌ Login error:", error);
        res.status(500).json({ message: "Server error during login" });
    }
};
exports.loginUser = loginUser;
// ✅ [3] - تسجيل خروج المستخدم
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        console.log("✅ User logged out");
        res.json({ message: "Logged out successfully", redirect: "/login" });
    }
    catch (error) {
        console.error("❌ Logout error:", error);
        res.status(500).json({ message: "Server error during logout" });
    }
};
exports.logoutUser = logoutUser;
