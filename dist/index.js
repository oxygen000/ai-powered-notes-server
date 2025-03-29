"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const db_1 = __importDefault(require("./config/db"));
const express_session_1 = __importDefault(require("express-session"));
const noteRoutes_1 = __importDefault(require("./routes/noteRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// 📌 تحميل متغيرات البيئة
dotenv_1.default.config();
const app = (0, express_1.default)();
// 📌 Middleware
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173", // غير هذا العنوان ليتناسب مع عنوان واجهتك الأمامية
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: "mySuperSecretKey123!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // اجعله `true` إذا كنت تستخدم HTTPS
        httpOnly: true,
        sameSite: "lax", // أو "none" مع `secure: true` إذا كنت تستخدم HTTPS
    }
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// 📌 تحديد معدل الطلبات لمنع الهجمات (مثل DDoS)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "⚠️ تم تجاوز الحد المسموح به من الطلبات، حاول لاحقًا!",
});
app.use(limiter);
if (process.env.NODE_ENV === "development") {
    app.use((0, morgan_1.default)("dev"));
}
// 📌 المسارات
app.use("/api/notes", noteRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
// 📌 Middleware لمعالجة الأخطاء
app.use(errorMiddleware_1.default);
// 📌 تشغيل السيرفر
const PORT = process.env.PORT || 5000;
const startServer = async () => {
    try {
        await (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT} in ${process.env.NODE_ENV} mode`);
        });
    }
    catch (error) {
        console.error("❌ Server startup failed:", error);
        process.exit(1);
    }
};
startServer();
