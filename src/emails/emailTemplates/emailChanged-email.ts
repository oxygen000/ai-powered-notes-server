export default function emailChangedTemplate(params: { name: string; oldEmail: string; newEmail: string }) {
    return {
      subject: "✉️ Your Email Has Been Updated",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #FFA500;">Email Address Updated</h2>
          <p>Hello ${params.name},</p>
          <p>Your email address has been updated from <strong>${params.oldEmail}</strong> to <strong>${params.newEmail}</strong>.</p>
          <p>Best regards,<br><strong>Your App Team</strong></p>
        </div>
      `,
    };
  }
  