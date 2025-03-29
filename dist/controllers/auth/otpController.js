"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOtp = void 0;
const User_1 = __importDefault(require("../../models/User"));
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            res.status(400).json({ message: "البريد الإلكتروني والـ OTP مطلوبان" });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "المستخدم غير موجود" });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ message: "المستخدم مفعل بالفعل" });
            return;
        }
        if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
            res.status(400).json({ message: "OTP غير صالح أو منتهي الصلاحية" });
            return;
        }
        user.isVerified = true;
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        res.status(200).json({ message: "تم تفعيل الحساب بنجاح!" });
    }
    catch (error) {
        res.status(500).json({ message: "خطأ في الخادم", error });
    }
};
exports.verifyOtp = verifyOtp;
