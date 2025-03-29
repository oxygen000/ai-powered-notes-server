import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db";
import session from "express-session";
import noteRoutes from "./routes/noteRoutes";
import userRoutes from "./routes/userRoutes";
import errorHandler from "./middleware/errorMiddleware";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(cookieParser());
app.use(
  cors({
    origin: "https://ai-powered-notes-frontend.vercel.app", // غيّره ليطابق واجهتك الأمامية
    credentials: true,
  })
);
app.use(
  session({
    secret: "mySuperSecretKey123!",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "⚠️ تم تجاوز الحد المسموح به من الطلبات، حاول لاحقًا!",
});
app.use(limiter);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/notes", noteRoutes);
app.use("/api/users", userRoutes);
app.use(errorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Server is running on Vercel!");
});

connectDB()
  .then(() => console.log("✅ Connected to Database"))
  .catch((err) => {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  });

// تصدير التطبيق ليعمل كـ Serverless Function
import { VercelRequest, VercelResponse } from "@vercel/node";
export default function handler(req: VercelRequest, res: VercelResponse) {
  app(req as unknown as Request, res as unknown as Response);
}
