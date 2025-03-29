"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = void 0;
const User_1 = __importDefault(require("../../models/User"));
const opt_1 = require("../../utils/opt");
const sendEmail_1 = require("../../emails/sendEmail");
const registerUser = async (req, res, next) => {
    try {
        let { name, username, email, password, role, avatar } = req.body;
        name = name?.trim();
        username = username?.trim();
        email = email?.trim().toLowerCase();
        password = password?.trim();
        if (!name || !username || !email || !password) {
            res.status(400).json({ message: "جميع الحقول مطلوبة" });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            res.status(400).json({ message: "تنسيق البريد الإلكتروني غير صالح" });
            return;
        }
        const existingUser = await User_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "المستخدم مسجل بالفعل" });
            return;
        }
        const otpCode = (0, opt_1.generateOtp)();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000);
        const newUser = new User_1.default({
            name,
            username,
            email,
            password,
            role: role || "user",
            avatar: avatar || "https://via.placeholder.com/150",
            otp: otpCode,
            otpExpires,
            isVerified: false,
        });
        await newUser.save();
        await (0, sendEmail_1.sendEmail)(newUser.email, "welcome", { name: newUser.name, otp: newUser.otp });
        res.status(201).json({
            message: "تم التسجيل بنجاح! تحقق من بريدك الإلكتروني لتفعيل الحساب.",
            userId: newUser._id,
            redirect: `/verify-otp?email=${newUser.email}`
        });
    }
    catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error });
    }
};
exports.registerUser = registerUser;
