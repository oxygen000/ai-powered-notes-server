import User from "../../models/User";
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ message: "Email and OTP are required" });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User is already verified" });
      return;
    }

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < new Date()) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: "Account successfully activated!" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
