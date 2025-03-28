import { Request, Response } from "express";
import User from "../models/User";

// 📌 جلب جميع المستخدمين (للمشرف فقط)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find().select("-password"); // استبعاد كلمات المرور
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
