"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = otpVerificationTemplate;
function otpVerificationTemplate(params) {
    return {
        subject: "🔢 Your Verification Code",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #52AE77;">Your One-Time Password (OTP)</h2>
          <p>Hello ${params.name},</p>
          <p>Your verification code is:</p>
          <p style="font-size: 24px; font-weight: bold; color: #52AE77;">${params.otpCode}</p>
          <p>Please use this code within <strong>10 minutes</strong> to complete the verification process.</p>
          <p>Best regards,<br><strong>Your App Team</strong></p>
        </div>
      `,
    };
}
