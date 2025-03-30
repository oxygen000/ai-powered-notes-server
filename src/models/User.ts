import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export interface IUser extends Document {
  username: string;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "moderator";
  avatar?: string;
  otp?: string | null;
  otpExpires?: Date | null;
  isVerified: boolean;
  isBanned: boolean;
  status: string; 
  failedLoginAttempts: number;
  lastLogin?: Date | null;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  generateResetToken: () => string;
}

const UserSchema: Schema<IUser> = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],  
    },
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, minlength: 8, select: false },
    role: {
      type: String,
      enum: ["user", "admin", "moderator"],
      default: "user",
    },
    avatar: { type: String, default: "" },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
    isVerified: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    status: { type: String, default: "active" }, 
    failedLoginAttempts: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.generateResetToken = function (): string {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); 

  return resetToken;
};

UserSchema.index({ email: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
