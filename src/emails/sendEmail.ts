import nodemailer from "nodemailer";
import emailTemplates from "./emailTemplates";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendEmail(to: string, templateKey: keyof typeof emailTemplates, params: any) {
  const templateFunction = emailTemplates[templateKey];

  if (!templateFunction) {
    throw new Error(`Email template "${templateKey}" not found.`);
  }

  const emailContent = templateFunction(params);

  try {
    const info = await transporter.sendMail({
      from: `"Ai Notes" <${process.env.GMAIL_USER}>`,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    console.log(`Email sent to ${to}: ${info.messageId}`);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Failed to send email", error };
  }
}
