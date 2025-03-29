"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = void 0;
// 📌 تسجيل الخروج
const logoutUser = async (req, res) => {
    try {
        res.status(200).json({ message: "Logged out successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.logoutUser = logoutUser;
