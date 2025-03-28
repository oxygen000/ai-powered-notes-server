import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import errorHandler from "./middleware/errorMiddleware";

// 📌 تحميل متغيرات البيئة
dotenv.config();

const app = express();

// 📌 Middleware
app.use(cors({ origin: process.env.ALLOWED_ORIGINS || "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());


// 📌 تحديد معدل الطلبات لمنع الهجمات (مثل DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "⚠️ تم تجاوز الحد المسموح به من الطلبات، حاول لاحقًا!",
});
app.use(limiter);


if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 📌 المسارات
app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);


// 📌 Middleware لمعالجة الأخطاء
app.use(errorHandler);

// 📌 تشغيل السيرفر
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
