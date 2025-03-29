"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = newLoginAlertTemplate;
function newLoginAlertTemplate(params) {
    return {
        subject: "🔔 New Login Alert",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #52AE77;">New Login Detected</h2>
          <p>Hello ${params.name},</p>
          <p>A new login to your account was detected:</p>
          <ul>
            <li><strong>IP Address:</strong> ${params.ip}</li>
            <li><strong>Location:</strong> ${params.location}</li>
          </ul>
          <p>Best regards,<br><strong>Your App Team</strong></p>
        </div>
      `,
    };
}
