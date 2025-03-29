"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = passwordChangedTemplate;
function passwordChangedTemplate(params) {
    return {
        subject: "✅ Your Password Has Been Changed",
        html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #52AE77;">Password Updated Successfully</h2>
          <p>Hello ${params.name},</p>
          <p>Your password has been updated successfully.</p>
          <p>If you didn’t make this change, please contact our support team immediately.</p>
          <p>Best regards,<br><strong>Your App Team</strong></p>
        </div>
      `,
    };
}
