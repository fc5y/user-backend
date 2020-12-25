const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const SEND_OTP_EMAIL_CONFIG = {
  displayed_name: "Free Contest",
  subject: "Mã xác minh (OTP)",
  template: "Mã xác minh (OTP) của bạn là ?, có hiệu lực trong vòng 10 phút.",
  templatePlaceholder: "?",
};

const transporter = nodemailer.createTransport({
  host: process.env.GMAIL_HOST,
  port: process.env.GMAIL_PORT,
  secure: true,
  auth: {
    type: "OAuth2",
    user: process.env.GMAIL_ADDRESS,
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    accessToken: process.env.GMAIL_ACCESS_TOKEN,
    refreshToken: process.env.GMAIL_REFRESH_TOKEN,
  },
});

function generateOtp() {
  return otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
}

async function sendOtpEmail({ email, otp }) {
  const {
    displayed_name,
    subject,
    template,
    templatePlaceholder,
  } = SEND_OTP_EMAIL_CONFIG;
  const info = await transporter.sendMail({
    from: `"${displayed_name}" <${process.env.GMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    text: template.replace(templatePlaceholder, otp),
  });
  return info;
}

module.exports = {
  generateOtp,
  sendOtpEmail,
};
