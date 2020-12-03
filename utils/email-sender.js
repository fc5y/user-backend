var nodemailer = require("nodemailer");

// TODO: Move clientId, clientSecret, accessToken, refreshToken to config file
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: "support@freecontest.net",
    clientId:
      "842534347250-gab56cijki54o5u10nqqtujsqk8hdh98.apps.googleusercontent.com",
    clientSecret: "FhZRuS7e-Jv5QPDz9KpqKLL1",
    accessToken:
      "ya29.a0AfH6SMDsh_otuSgdto0EVkm6IlYwRdPAVwjmVbZ6dyOkOXEOIZOWXPss3HYXxU5JdcRaXkmSv8bl-HjI1OP5Hpj7nwLp4-d6LnaODa69OITTUrlWNluXEbJA_IF7YTlLy4w2nNIyfuY1c5IfycJPPHAJMWP3eWXEPNxuGFZbfSs",
    refreshToken:
      "1//04ufA4Ye4Rtq_CgYIARAAGAQSNwF-L9IrGUyVZGW_ruK2Fl98At1nJWaLa-xNLKN60koB04U0F_cnTMPP_ckov0h0YsShFbkyUFQ",
  },
});

function createMessage(recipients, subject, textBody, htmlBody) {
  const message = {
    // sender info
    from: "Free Contest <support@freecontest.net>",
    // Comma separated list of recipients
    to: recipients,
    // Subject of the message
    subject: subject,
    // plaintext body
    text: textBody,
    // HTML body
    html: htmlBody,
  };
  return message;
}

// Followed this guide: https://www.youtube.com/watch?v=jhxzhpFanfU
function sendMail(message) {
  transporter.sendMail(message, function (error) {
    if (error) {
      console.log("Message sent unsuccessfully. Error: ", error.message);
      return false;
    }
  });
  console.log("Message sent successfully!");
  return true;
}

module.exports = {
  sendMail,
  createMessage,
};
