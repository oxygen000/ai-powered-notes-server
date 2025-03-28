export default function welcomeTemplate(params: { name: string; otp: string }) {
  return {
    subject: "🎉 Welcome to Your App! Verify Your Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
        
        <h2 style="color: #52AE77; text-align: center;">Welcome, ${params.name}! 🎉</h2>
        <p style="font-size: 16px; text-align: center;">
          We’re excited to have you join <strong>Your App</strong>! 🚀
        </p>

        <p style="font-size: 16px; text-align: center;">
          To complete your registration, please use the following one-time password (OTP):
        </p>

        <div style="text-align: center; margin: 20px 0;">
          <span style="font-size: 24px; font-weight: bold; background: #52AE77; color: white; padding: 12px 20px; border-radius: 5px;">
            ${params.otp}
          </span>
        </div>

        <p style="font-size: 14px; text-align: center;">
          This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.
        </p>

        <hr style="border: none; border-top: 1px solid #ccc;" />

        <p style="font-size: 14px; text-align: center;">
          If you didn't sign up for this account, please ignore this email.
        </p>

        <p style="font-size: 14px; text-align: center;">
          Need help? Visit our <a href="https://yourapp.com/support" style="color: #52AE77;">Support Center</a>.
        </p>

        <p style="font-size: 14px; text-align: center; color: #666;">
          Best regards,<br><strong>Your App Team</strong>
        </p>

      </div>
    `,
  };
}
