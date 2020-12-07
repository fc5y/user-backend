var nodemailer = require("nodemailer");
const errors = require("./error");

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

function createMessage(recipients, subject, textBody, htmlBody) {
  const message = {
    from: `Free Contest ${process.env.GMAIL_ADDRESS}`,
    to: recipients,
    subject: subject,
    text: textBody,
    html: htmlBody,
  };
  return message;
}

// Followed this guide: https://www.youtube.com/watch?v=jhxzhpFanfU
async function sendMail(message) {
  await transporter.sendMail(message)
  .catch((_error) => {
    throw new errors.FcError(errors.SEND_EMAIL_ERROR);
  });
}

module.exports = {
  sendMail,
  createMessage,
};
