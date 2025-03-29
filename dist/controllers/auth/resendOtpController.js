"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = void 0;
const User_1 = __importDefault(require("../../models/User"));
const sendEmail_1 = require("../../emails/sendEmail");
const opt_1 = require("../../utils/opt");
const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required." });
            return;
        }
        const user = await User_1.default.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }
        if (user.isVerified) {
            res.status(400).json({ message: "Account is already verified." });
            return;
        }
        // Generate new OTP and update user
        const newOtp = (0, opt_1.generateOtp)();
        user.otp = newOtp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        await user.save();
        // Send OTP via email
        await (0, sendEmail_1.sendEmail)(user.email, "welcome", { name: user.name, otp: newOtp });
        res.status(200).json({ message: "A new OTP has been sent to your email." });
    }
    catch (error) {
        console.error("Error in resendOtp:", error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Internal server error.", error: errorMessage });
    }
};
exports.resendOtp = resendOtp;
