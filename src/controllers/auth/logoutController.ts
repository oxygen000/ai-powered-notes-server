import { Request, Response } from "express";

// ✅ تعريف نوع `AuthRequest` ليشمل `user`
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}


// 📌 تسجيل الخروج
export const logoutUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

