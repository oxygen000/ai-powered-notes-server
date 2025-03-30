import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}


export const logoutUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

