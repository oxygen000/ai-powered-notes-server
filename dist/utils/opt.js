"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.sendOTP = exports.verifyOtpExpiration = exports.generateOtp = void 0;
const User_1 = __importDefault(require("../models/User"));
// 🛠️ إنشاء OTP عشوائي بطول 6 أرقام
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
// 📌 التحقق من انتهاء صلاحية OTP
const verifyOtpExpiration = (otpExpires) => {
    return new Date() < new Date(otpExpires);
};
exports.verifyOtpExpiration = verifyOtpExpiration;
// 📩 إرسال OTP عبر البريد الإلكتروني (محاكي)
const sendOTP = async (email, otp) => {
    console.log(`📧 إرسال OTP: ${otp} إلى البريد الإلكتروني: ${email}`);
    // هنا يمكنك دمج خدمة إرسال بريد إلكتروني مثل Nodemailer أو Twilio SendGrid
};
exports.sendOTP = sendOTP;
// ✅ التحقق من صحة OTP
const verifyOTP = async (email, otp) => {
    const user = await User_1.default.findOne({ email });
    if (!user || !user.otp || !user.otpExpires)
        return false;
    if (user.otp === otp && user.otpExpires > new Date()) {
        // إزالة OTP بعد الاستخدام
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        return true;
    }
    return false;
};
exports.verifyOTP = verifyOTP;
