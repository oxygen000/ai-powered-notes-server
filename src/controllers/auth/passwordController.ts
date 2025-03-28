import { NextFunction, Request, Response } from "express";
import User from "../../models/User";
import { generateOtp, verifyOtpExpiration } from "../../utils/opt";
import bcrypt from "bcryptjs";
import emailTemplates from "../../emails/emailTemplates";
import { sendEmail } from "../../emails/sendEmail";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// 📌 طلب إعادة تعيين كلمة المرور (إرسال OTP)
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "User not found" });
      return;
    }

    // 🔹 إنشاء OTP جديد
    const otpCode = generateOtp();
    user.otp = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // مدة الصلاحية 10 دقائق

    await user.save();

    // 📨 إرسال OTP عبر البريد الإلكتروني
    const { subject, html } = emailTemplates.otpVerification({ name: user.name, otpCode });
    await sendEmail(email, "passwordChanged", { subject, html });

    res.status(200).json({ message: "OTP sent to your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 إعادة تعيين كلمة المرور باستخدام OTP
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.otp || !user.otpExpires) {
      res.status(400).json({ message: "Invalid OTP or user not found" });
      return;
    }

    if (!verifyOtpExpiration(user.otpExpires)) {
      res.status(400).json({ message: "OTP expired" });
      return;
    }

    if (user.otp !== otp) {
      res.status(400).json({ message: "Incorrect OTP" });
      return;
    }

    // 🔹 تحديث كلمة المرور
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // 🔹 إزالة OTP بعد الاستخدام
    user.otp = null;
    user.otpExpires = null;

    await user.save();

    // 📨 إرسال تأكيد إعادة تعيين كلمة المرور
    const { subject, html } = emailTemplates.passwordChanged({ name: user.name });
    await sendEmail(email, "passwordChanged", { subject, html });

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 تغيير كلمة المرور عند معرفة القديمة
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "Incorrect old password" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 إعادة تعيين كلمة المرور باستخدام رابط التأكيد
export const newPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    // 📨 إرسال بريد تأكيد تغيير كلمة المرور
    const { subject, html } = emailTemplates.passwordChanged({ name: user.name });
    await sendEmail(email, "passwordChanged", { subject, html });

    res.json({ message: "Password changed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error });
  }
};
