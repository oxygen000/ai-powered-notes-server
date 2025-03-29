"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = passwordResetTemplate;
function passwordResetTemplate(params) {
    return {
        subject: "🔐 Password Reset Request",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #E63946;">Password Reset Request</h2>
          <p>Hello ${params.name},</p>
          <p>We received a request to reset your password. Click the button below to proceed:</p>
          <p>
            <a href="${params.resetLink}" style="background-color: #52AE77; color: white; padding: 12px 20px; text-decoration: none; font-size: 16px; border-radius: 5px;">
              🔑 Reset Password
            </a>
          </p>
          <p>Best regards,<br><strong>Your App Team</strong></p>
        </div>
      `,
    };
}
