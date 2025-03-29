"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = accountDeletedTemplate;
function accountDeletedTemplate(params) {
    return {
        subject: "🗑️ Account Deletion Confirmation",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #E63946;">Account Deletion Confirmation</h2>
          <p>Hello ${params.name},</p>
          <p>We’re sorry to see you go. Your account has been permanently deleted.</p>
          <p>Best regards,<br><strong>Your App Team</strong></p>
        </div>
      `,
    };
}
