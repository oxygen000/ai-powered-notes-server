import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../../models/User";
import jwt from "jsonwebtoken";

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

    // ✅ إرفاق بيانات المستخدم بالطلب
    req.user = { id: decoded.id, role: decoded.role };

    next();
  } catch (error) {
    console.error("🔴 Authentication error:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// ✅ التحقق من صلاحيات المسؤول (Admin)
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ message: "Access denied. Admins only." });
    return;
  }
  next();
};
