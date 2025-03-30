import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendEmail } from "../../emails/sendEmail";

// ✅ تعريف نوع `AuthRequest` ليشمل بيانات المستخدم
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// ✅ إنشاء توكن JWT مع إضافة الدور
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// ✅ تسجيل الدخول
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required" });
      return;
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
      return;
    }

    // ✅ التحقق مما إذا كان الحساب غير مفعل بسبب OTP
    if (user.otp) {
      // إذا كان الـ OTP منتهي الصلاحية، قم بإرسال واحد جديد
      if (!user.otpExpires || new Date(user.otpExpires).getTime() < Date.now()) {
        user.otp = crypto.randomInt(100000, 999999).toString(); // كود عشوائي من 6 أرقام
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // مدة الصلاحية 10 دقائق
        await user.save();

        // إرسال OTP جديد
        await sendEmail(user.email, "welcome", { name: user.name, otp: user.otp });
      }

      res.status(400).json({
        message: "Your account is not verified. We have sent a new OTP. Please verify your account.",
        redirectTo: "/verify-otp",
        email: user.email, // إرسال البريد الإلكتروني للفرونت لعرضه في صفحة التحقق
      });
      return;
    }

    if (!user.password) {
      res.status(400).json({ message: "User password is missing in the database." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
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
  } catch (error) {
    console.error("❌ Server error:", error);
    res.status(500).json({ message: "An unexpected server error occurred.", error });
  }
};

// ✅ ميدلوير الحماية
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    // ✅ استخراج التوكن من الهيدر
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      res.status(401).json({ message: "Not authorized, token is missing" });
      return;
    }

    // ✅ التحقق من صحة التوكن
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string; role: string };

    // ✅ جلب المستخدم بناءً على التوكن
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: "User not found. Authorization denied." });
      return;
    }

    req.user = { id: user.id, role: user.role };

    next();
  } catch (error) {
    console.error("🔴 Authentication error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};