import nodemailer from "nodemailer";
require("dotenv").config();

let sendOtpResetPassword = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"BamitoSports" <nhuthz10@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Mã xác thực đổi mật khẩu",
    html: bodyHTMLResetPass(dataSend),
  });
};

let bodyHTMLResetPass = (dataSend) => {
  return `
    <h1>Xin chào ${dataSend.userName}</h1>
    <p>Mã xác nhận của bạn là: ${dataSend.otpCode}</p>
    <p>Lưu ý: Yêu cầu này này chỉ có hiệu lực trong 3 phút.</p>
  `;
};

let sendLinkAuthenEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: '"BamitoSports" <nhuthz10@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Xác thực Email",
    html: bodyHTMLAuthenEmail(dataSend),
  });
};

let bodyHTMLAuthenEmail = (dataSend) => {
  return `
    <div style="height: 200px">
    <h1>Xin chào ${dataSend.userName}</h1>
    <h3 style="line-height: 1.8">Hãy click vào xác nhận để hoàn tất quá trình đăng kí tài khoản</h3>
    <a href="${process.env.URL_SERVER}/api/user/auth-email?token=${dataSend.token}"
      style="
        flex: 1;
        padding: 15px 20px;
        text-decoration: none;
        background: #f46f25;
        color: white;
        border-radius: 25px;
        ">
        Xác nhận</a>
    </div>
  `;
};

module.exports = {
  sendOtpResetPassword,
  sendLinkAuthenEmail,
};
