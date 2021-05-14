const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const { google } = require("googleapis");

const commonUtils = require("../utils/common");

const SEND_OTP_EMAIL_CONFIG = {
  displayed_name: "Free Contest",
  subject: "Mã xác minh (OTP)",
  template: "Mã xác minh (OTP) của bạn là ?, có hiệu lực trong vòng 10 phút.",
  templatePlaceholder: "?",
};

async function getTransporter() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
  });

  const accessToken = await oauth2Client.getAccessToken();

  const smtpTransporter = nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: process.env.GMAIL_PORT,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_ADDRESS,
      clientId: process.env.GMAIL_CLIENT_ID,
      clientSecret: process.env.GMAIL_CLIENT_SECRET,
      accessToken,
      refreshToken: process.env.GMAIL_REFRESH_TOKEN,
    },
  });

  return smtpTransporter;
}

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
  const smtpTransporter = await getTransporter();

  const info = await smtpTransporter.sendMail({
    from: `"${displayed_name}" <${process.env.GMAIL_ADDRESS}>`,
    to: email,
    subject: subject,
    text: template.replace(templatePlaceholder, otp),
  });
  return info;
}

class RateLimiter {
  constructor({ limit, interval }) {
    this.limit = limit;
    this.interval = interval;
    this.queue = [];
  }

  _clean() {
    const currentTimestamp = commonUtils.getTimestampNow();
    while (
      this.queue.length > 0 &&
      currentTimestamp - this.queue[0].createdAt > this.interval
    ) {
      this.queue.shift();
    }
  }

  isFull(key) {
    this._clean();
    const numQueued = this.queue.filter((item) => item.key === key).length;
    return numQueued >= this.limit;
  }

  push(key) {
    this._clean();
    const currentTimestamp = commonUtils.getTimestampNow();
    this.queue.push({ createdAt: currentTimestamp, key });
  }
}

const rateLimiters = {
  sendOtpPerEmail: new RateLimiter({ limit: 5, interval: 300 }), // 5 OTPs in 5 minutes
  sendOtpOverall: new RateLimiter({ limit: 500, interval: 60 }), // 500 OTPs in 1 minute
  verifyOtpPerEmail: new RateLimiter({ limit: 10, interval: 300 }), // 10 OTPs in 5 minutes
};

module.exports = {
  generateOtp,
  sendOtpEmail,
  rateLimiters,
};
