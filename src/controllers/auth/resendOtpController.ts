import User from "../../models/User";
import { Request, Response } from "express";
import { sendEmail } from "../../emails/sendEmail";
import { generateOtp } from "../../utils/opt";

export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: "Email is required." });
      return;
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "Account is already verified." });
      return;
    }

    // Generate new OTP and update user
    const newOtp = generateOtp();
    user.otp = newOtp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    await user.save();

    // Send OTP via email
    await sendEmail(user.email, "welcome", { name: user.name, otp: newOtp });

    res.status(200).json({ message: "A new OTP has been sent to your email." });
  } catch (error) {
    console.error("Error in resendOtp:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ message: "Internal server error.", error: errorMessage });
  }
};
