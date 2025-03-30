import User from "../models/User";

export const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const verifyOtpExpiration = (otpExpires: Date): boolean => {
  return new Date() < new Date(otpExpires);
};

export const sendOTP = async (email: string, otp: string): Promise<void> => {
  console.log(`📧 Sending OTP: ${otp} to email: ${email}`);
};

export const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  const user = await User.findOne({ email });
  if (!user || !user.otp || !user.otpExpires) return false;

  if (user.otp === otp && user.otpExpires > new Date()) {
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    return true;
  }
  return false;
};
