var nodemailer = require("nodemailer");

// TODO: Move clientId, clientSecret, accessToken, refreshToken to config file
var transport = nodemailer.createTransport({
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

function sendMail(message) {
  transport.sendMail(message, function (error) {
    if (error) {
      console.log("Error occured");
      console.log(error.message);
      return;
    }
    console.log("Message sent successfully!");

    // if you don't want to use this transport object anymore, uncomment following line
    //transport.close(); // close the connection pool
  });
}

module.exports = {
  sendMail,
  createMessage,
};
