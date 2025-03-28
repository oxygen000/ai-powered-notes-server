import { Request, Response, NextFunction } from "express";

// 📌 Middleware لمعالجة الأخطاء العامة
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`❌ Error: ${err.message}`);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "حدث خطأ في السيرفر",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // ✅ إظهار التفاصيل فقط في وضع التطوير
  });
};

export default errorHandler;
