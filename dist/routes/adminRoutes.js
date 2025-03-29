"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const adminController_1 = require("../controllers/adminController"); // دالة لاسترداد المستخدمين
const router = express_1.default.Router();
// ✅ لوحة تحكم المشرف
router.get("/dashboard", adminMiddleware_1.protect, adminMiddleware_1.isAdmin, (req, res) => {
    res.json({ message: "Welcome Admin" });
});
// ✅ استرداد جميع المستخدمين (للمشرفين فقط)
router.get("/users", adminMiddleware_1.protect, adminMiddleware_1.isAdmin, adminController_1.getUsers);
exports.default = router;
