import nodemailer from "nodemailer";
import dotenv from "dotenv";

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

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: `"Nhật Ký Cá Nhân" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Yêu cầu đặt lại mật khẩu",
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
                <h1>Yêu cầu đặt lại mật khẩu</h1>
              </div>
              <div class="content">
                <p>Xin chào,</p>
                <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Nhật Ký Cá Nhân của bạn.</p>
                <p>Hãy nhấn vào nút bên dưới để đặt lại mật khẩu. Liên kết này sẽ hết hạn sau <strong>15 phút</strong>.</p>
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
                </div>
                <p>Hoặc bạn có thể sao chép và dán đường dẫn này vào trình duyệt:</p>
                <p style="word-break: break-all; color: #0066cc;">${resetUrl}</p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.</p>
                <div class="footer">
                  <p>Đây là email tự động, vui lòng không trả lời email này.</p>
                  <p>© 2026 Nhật Ký Cá Nhân. Bảo lưu mọi quyền.</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Yêu cầu đặt lại mật khẩu
        
        Xin chào,
        
        Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản Nhật Ký Cá Nhân của bạn.
        
        Nhấn vào liên kết dưới đây để đặt lại mật khẩu. Liên kết sẽ hết hạn sau 15 phút.
        
        ${resetUrl}
        
        Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này. Mật khẩu của bạn sẽ không thay đổi.
        
        © 2026 Nhật Ký Cá Nhân. Bảo lưu mọi quyền.
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Đã gửi email đặt lại mật khẩu tới ${email}`);
  } catch (error) {
    console.error("Lỗi khi gửi email đặt lại mật khẩu:", error);
    throw new Error("Không thể gửi email đặt lại mật khẩu");
  }
};