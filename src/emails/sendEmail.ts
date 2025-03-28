import nodemailer from "nodemailer";
import emailTemplates from "./emailTemplates";
import dotenv from "dotenv";

dotenv.config();

// إنشاء ناقل البريد الإلكتروني باستخدام إعدادات Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587, // يمكنك استخدام 2525 أيضًا حسب الإعدادات في Mailtrap
  auth: {
    user: process.env.MAILTRAP_USER, // اسم المستخدم من Mailtrap
    pass: process.env.MAILTRAP_PASS, // كلمة المرور من Mailtrap
  },
});

/**
 * دالة لإرسال البريد الإلكتروني باستخدام Mailtrap
 * @param to البريد الإلكتروني للمرسل إليه
 * @param templateKey اسم قالب البريد
 * @param params المعطيات المخصصة للقالب
 */
export async function sendEmail(to: string, templateKey: keyof typeof emailTemplates, params: any) {
  const templateFunction = emailTemplates[templateKey];

  if (!templateFunction) {
    throw new Error(`Template "${templateKey}" not found.`);
  }

  // توليد محتوى البريد من القالب
  const emailContent = templateFunction(params);

  try {
    // إرسال البريد الإلكتروني عبر Mailtrap
    const info = await transporter.sendMail({
      from: '"Ai Powered Notes" <no-reply@yourapp.com>', // عنوان المرسل
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`📩 Email sent to ${to}: ${info.messageId}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
}
