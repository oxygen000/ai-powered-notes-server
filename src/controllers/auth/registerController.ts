import { Request, Response, NextFunction } from "express";
import User from "../../models/User";
import { generateOtp } from "../../utils/opt";
import emailTemplates from "../../emails/emailTemplates";
import { sendEmail } from "../../emails/sendEmail";

export const registerUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "المستخدم مسجل بالفعل" });
      return;
    }

    const otpCode = generateOtp();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
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

    await sendEmail(newUser.email, "welcome", { name: newUser.name, otp: newUser.otp });

    res.status(201).json({ 
      message: "تم التسجيل بنجاح! تحقق من بريدك الإلكتروني لتفعيل الحساب.",
      userId: newUser._id,
      redirect: `/verify-otp?email=${newUser.email}`
    });

  } catch (error) {
    res.status(500).json({ message: "خطأ في الخادم", error });
  }
};
