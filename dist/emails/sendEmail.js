"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
const emailTemplates_1 = __importDefault(require("./emailTemplates"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    service: "gmail", // استخدام Gmail
    host: "smtp.gmail.com", // خادم SMTP لـ Gmail
    port: 465, // المنفذ المشفر (TLS)
    secure: true, // استخدم SSL/TLS
    auth: {
        user: process.env.GMAIL_USER, // بريد Gmail المرسل
        pass: process.env.GMAIL_APP_PASSWORD, // كلمة مرور التطبيق (App Password)
    },
});
/**
 * إرسال البريد الإلكتروني عبر Gmail SMTP
 * @param to البريد الإلكتروني للمستلم
 * @param templateKey مفتاح القالب المستخدم
 * @param params البيانات المستخدمة داخل القالب
 */
async function sendEmail(to, templateKey, params) {
    const templateFunction = emailTemplates_1.default[templateKey];
    if (!templateFunction) {
        throw new Error(`❌ قالب البريد "${templateKey}" غير موجود.`);
    }
    const emailContent = templateFunction(params);
    try {
        const info = await transporter.sendMail({
            from: `"Ai Notes" <${process.env.GMAIL_USER}>`, // بريد المرسل
            to,
            subject: emailContent.subject,
            html: emailContent.html,
        });
        console.log(`📩 تم إرسال البريد إلى ${to}: ${info.messageId}`);
        return { success: true, message: "تم إرسال البريد بنجاح" };
    }
    catch (error) {
        console.error("❌ خطأ أثناء إرسال البريد:", error);
        return { success: false, message: "فشل إرسال البريد", error };
    }
}
