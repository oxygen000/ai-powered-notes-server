"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newPassword = exports.changePassword = exports.resetPassword = exports.requestPasswordReset = void 0;
const User_1 = __importDefault(require("../../models/User"));
const opt_1 = require("../../utils/opt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const emailTemplates_1 = __importDefault(require("../../emails/emailTemplates"));
const sendEmail_1 = require("../../emails/sendEmail");
// 📌 طلب إعادة تعيين كلمة المرور (إرسال OTP)
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User not found" });
            return;
        }
        // 🔹 إنشاء OTP جديد
        const otpCode = (0, opt_1.generateOtp)();
        user.otp = otpCode;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // مدة الصلاحية 10 دقائق
        await user.save();
        // 📨 إرسال OTP عبر البريد الإلكتروني
        const { subject, html } = emailTemplates_1.default.otpVerification({ name: user.name, otpCode });
        await (0, sendEmail_1.sendEmail)(email, "passwordChanged", { subject, html });
        res.status(200).json({ message: "OTP sent to your email." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.requestPasswordReset = requestPasswordReset;
// 📌 إعادة تعيين كلمة المرور باستخدام OTP
const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user || !user.otp || !user.otpExpires) {
            res.status(400).json({ message: "Invalid OTP or user not found" });
            return;
        }
        if (!(0, opt_1.verifyOtpExpiration)(user.otpExpires)) {
            res.status(400).json({ message: "OTP expired" });
            return;
        }
        if (user.otp !== otp) {
            res.status(400).json({ message: "Incorrect OTP" });
            return;
        }
        // 🔹 تحديث كلمة المرور
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(newPassword, salt);
        // 🔹 إزالة OTP بعد الاستخدام
        user.otp = null;
        user.otpExpires = null;
        await user.save();
        // 📨 إرسال تأكيد إعادة تعيين كلمة المرور
        const { subject, html } = emailTemplates_1.default.passwordChanged({ name: user.name });
        await (0, sendEmail_1.sendEmail)(email, "passwordChanged", { subject, html });
        res.status(200).json({ message: "Password reset successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.resetPassword = resetPassword;
// 📌 تغيير كلمة المرور عند معرفة القديمة
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "Unauthorized" });
            return;
        }
        const { oldPassword, newPassword } = req.body;
        const user = await User_1.default.findById(req.user.id);
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(oldPassword, user.password);
        if (!isMatch) {
            res.status(400).json({ message: "Incorrect old password" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ message: "Password changed successfully." });
    }
    catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};
exports.changePassword = changePassword;
// 📌 إعادة تعيين كلمة المرور باستخدام رابط التأكيد
const newPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        user.password = await bcryptjs_1.default.hash(newPassword, salt);
        await user.save();
        // 📨 إرسال بريد تأكيد تغيير كلمة المرور
        const { subject, html } = emailTemplates_1.default.passwordChanged({ name: user.name });
        await (0, sendEmail_1.sendEmail)(email, "passwordChanged", { subject, html });
        res.json({ message: "Password changed successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "Error changing password", error });
    }
};
exports.newPassword = newPassword;
