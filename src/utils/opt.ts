import crypto from "crypto";
import User from "../models/User";

// 🛠️ إنشاء OTP عشوائي بطول 6 أرقام
export const generateOtp = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };
  
  // 📌 التحقق من انتهاء صلاحية OTP
  export const verifyOtpExpiration = (otpExpires: Date): boolean => {
    return new Date() < new Date(otpExpires);
  };

// 📩 إرسال OTP عبر البريد الإلكتروني (محاكي)
export const sendOTP = async (email: string, otp: string): Promise<void> => {
  console.log(`📧 إرسال OTP: ${otp} إلى البريد الإلكتروني: ${email}`);
  // هنا يمكنك دمج خدمة إرسال بريد إلكتروني مثل Nodemailer أو Twilio SendGrid
};

// ✅ التحقق من صحة OTP
export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpires) return false;

  if (user.otp === otp && user.otpExpires > new Date()) {
    // إزالة OTP بعد الاستخدام
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return true;
  }
  return false;
};