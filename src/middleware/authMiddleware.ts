import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

// ✅ تعريف نوع `AuthRequest` ليشمل `user`
interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

// 📌 حماية المسارات باستخدام JWT
export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
      }

      req.user = { id: user.id, role: user.role }; // 🛡️ إضافة الدور (Role)
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// 📌 Middleware للتحقق من دور المستخدم (Admin فقط)
export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: "Not authorized" });
    return;
  }

  const user = await User.findById(req.user.id);

  if (!user || user.role !== "admin") {
    res.status(403).json({ message: "Not authorized as admin" });
    return;
  }

  next();
};