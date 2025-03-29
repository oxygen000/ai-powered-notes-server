"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
// 📌 حماية المسارات باستخدام JWT
const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (!user) {
                res.status(401).json({ message: "User not found" });
                return;
            }
            req.user = { id: user.id, role: user.role }; // 🛡️ إضافة الدور (Role)
            next();
        }
        catch (error) {
            res.status(401).json({ message: "Invalid token" });
        }
    }
    if (!token) {
        res.status(401).json({ message: "Not authorized, no token" });
    }
};
exports.protect = protect;
// 📌 Middleware للتحقق من دور المستخدم (Admin فقط)
const isAdmin = async (req, res, next) => {
    if (!req.user) {
        res.status(401).json({ message: "Not authorized" });
        return;
    }
    const user = await User_1.default.findById(req.user.id);
    if (!user || user.role !== "admin") {
        res.status(403).json({ message: "Not authorized as admin" });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
