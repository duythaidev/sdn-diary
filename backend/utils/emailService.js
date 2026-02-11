import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT || 587,
    // secure: process.env.EMAIL_PORT == 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

export const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Personal Journal App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .header {
                background-color: #0f1c24;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 8px 8px 0 0;
              }
              .content {
                background-color: #f9f9f9;
                padding: 30px;
                border-radius: 0 0 8px 8px;
              }
              .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #0f1c24;
                color: white !important;
                text-decoration: none;
                border-radius: 6px;
                margin: 20px 0;
              }
              .footer {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #ddd;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Password Reset Request</h1>
              </div>
              <div class="content">
                <p>Hello,</p>
                <p>We received a request to reset your password for your Personal Journal App account.</p>
                <p>Click the button below to reset your password. This link will expire in <strong>15 minutes</strong>.</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Reset Password</a>
                </div>
                <p>Or copy and paste this link into your browser:</p>
                <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
                <div class="footer">
                  <p>This is an automated email. Please do not reply to this message.</p>
                  <p>© 2024 Personal Journal App. All rights reserved.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hello,
        
        We received a request to reset your password for your Personal Journal App account.
        
        Click the link below to reset your password. This link will expire in 15 minutes.
        
        ${resetUrl}
        
        If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
        
        © 2024 Personal Journal App. All rights reserved.
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};
