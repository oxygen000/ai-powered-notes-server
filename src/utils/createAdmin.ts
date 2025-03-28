import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User";
import sendEmail from "../emails/sendEmail";

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL as string, { dbName: "ai-powered-notes" });

    const adminExists = await User.findOne({ role: "admin" });
    if (adminExists) {
      console.log("✅ Admin already exists");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    const admin = new User({
      name: "Super Admin",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "admin",
    });

    await admin.save();

    // 📩 إرسال بريد ترحيبي للأدمن
    await sendEmail(
      "admin@admin.com",
      "Welcome to AI-Powered Notes",
      "🎉 Your admin account has been created! Use email: admin@admin.com and password: admin123"
    );

    console.log("🚀 Admin account created successfully");
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    mongoose.connection.close();
  }
};

export default createAdmin;
