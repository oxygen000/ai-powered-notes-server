"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUser = exports.getUserById = exports.deleteAccount = exports.updateUserProfile = exports.getUserProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware_1 = require("../middleware/authMiddleware");
// 📌 إنشاء توكن JWT مع إضافة الدور
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
// 📌 جلب بيانات المستخدم
const getUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User_1.default.findById(req.user.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("❌ Error fetching user profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getUserProfile = getUserProfile;
// 📌 تحديث بيانات المستخدم
const updateUserProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { username, avatar } = req.body;
        if (username)
            user.username = username;
        if (avatar)
            user.avatar = avatar;
        await user.save();
        res.status(200).json({
            _id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            token: generateToken(user.id, user.role),
        });
    }
    catch (error) {
        console.error("❌ Error updating user profile:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.updateUserProfile = updateUserProfile;
// 📌 حذف الحساب نهائيًا
const deleteAccount = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        await User_1.default.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: "Account deleted successfully." });
    }
    catch (error) {
        console.error("❌ Error deleting account:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.deleteAccount = deleteAccount;
// 📌 جلب بيانات مستخدم معين عبر الـ ID
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User_1.default.findById(id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("❌ Error fetching user by ID:", error);
        res.status(500).json({ message: "Server error", error });
    }
};
exports.getUserById = getUserById;
// 📌 جلب بيانات المستخدم عبر التوكن
const getUser = (req, res) => {
    (0, authMiddleware_1.authenticateUser)(req, res, () => {
        res.status(200).json({ user: req.user });
    });
};
exports.getUser = getUser;
