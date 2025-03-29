import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";
import { authenticateUser } from "../middleware/authMiddleware";

// ✅ تعريف نوع `AuthRequest` ليشمل `user`
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// 📌 إنشاء توكن JWT مع إضافة الدور
const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET as string, {
    expiresIn: "30d",
  });
};

// 📌 جلب بيانات المستخدم
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 تحديث بيانات المستخدم
export const updateUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { username, avatar } = req.body;
    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    await user.save();

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
    console.error("❌ Error updating user profile:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 حذف الحساب نهائيًا
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    await User.findByIdAndDelete(req.user.id);
    res.status(200).json({ message: "Account deleted successfully." });
  } catch (error) {
    console.error("❌ Error deleting account:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 جلب بيانات مستخدم معين عبر الـ ID
export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// 📌 جلب بيانات المستخدم عبر التوكن
export const getUser = (req: Request, res: Response): void => {
  authenticateUser(req, res, () => {
    res.status(200).json({ user: (req as AuthRequest).user });
  });
};
