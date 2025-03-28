import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("❌ MONGO_URL is not defined in .env file!");
    }
    const conn = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "ai-powered-notes", 
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error}`);
    process.exit(1);
  }
};

export default connectDB;
