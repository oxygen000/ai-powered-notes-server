"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.protect = exports.loginUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ✅ إنشاء توكن JWT مع إضافة الدور
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};
// ✅ تسجيل الدخول
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: "Email and password are required" });
            return;
        }
        const user = await User_1.default.findOne({ email }).select("+password");
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        // ✅ التحقق مما إذا كان الحساب يحتاج إلى تفعيل (OTP موجود)
        if (user.otp) {
            if (user.otpExpires && new Date(user.otpExpires) < new Date()) {
                res.status(400).json({ message: "OTP expired. Please request a new OTP." });
                return;
            }
            res.status(400).json({ message: "Please verify your OTP before logging in." });
            return;
        }
        if (!user.password) {
            res.status(400).json({ message: "User password is missing in the database." });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
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
        console.error("❌ Server error:", error);
        res.status(500).json({ message: "An unexpected server error occurred.", error });
    }
};
exports.loginUser = loginUser;
// ✅ ميدلوير الحماية
const protect = async (req, res, next) => {
    try {
        let token;
        // ✅ استخراج التوكن من الهيدر
        if (req.headers.authorization?.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            res.status(401).json({ message: "Not authorized, token is missing" });
            return;
        }
        // ✅ التحقق من صحة التوكن
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // ✅ إرفاق بيانات المستخدم بالطلب
        req.user = { id: decoded.id, role: decoded.role };
        next();
    }
    catch (error) {
        console.error("🔴 Authentication error:", error);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.protect = protect;
// ✅ التحقق من صلاحيات المسؤول (Admin)
const isAdmin = async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
        res.status(403).json({ message: "Access denied. Admins only." });
        return;
    }
    next();
};
exports.isAdmin = isAdmin;
