"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// 📌 Middleware لمعالجة الأخطاء العامة
const errorHandler = (err, req, res, next) => {
    console.error(`❌ Error: ${err.message}`);
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "حدث خطأ في السيرفر",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // ✅ إظهار التفاصيل فقط في وضع التطوير
    });
};
exports.default = errorHandler;
