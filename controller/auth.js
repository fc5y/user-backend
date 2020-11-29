const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ slient: true });

const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode } = require("../utils");
const EMAIL_REGEX = /^([0-9a-zA-Z].*?@([0-9a-zA-Z].*\.\w{2,4}))$/;

function isEmail(email_or_username) {
  return EMAIL_REGEX.test(email_or_username);
}

async function login(req, res) {
  if (req.user) {
    return res.status(statusCode.SUCCESS).json({
      msg: "Already logged in",
      data: {
        access_token: jwt.sign(
          { email: req.user.email },
          process.env.JWT_SECRET
        ),
      },
    });
  }

  const { email_or_username, password } = req.body;
  if (!email_or_username || !password) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send("Email/Username or password is incorrect");
  }

  let user;
  if (isEmail(email_or_username)) {
    user = await models.User.findOne({
      where: {
        email: email_or_username,
      },
    });
  } else {
    user = await models.User.findOne({
      where: {
        username: email_or_username,
      },
    });
  }

  if (!user) {
    return res
      .status(statusCode.BAD_REQUEST)
      .send("Email/Username or password is incorrect");
  }

  if (bcrypt.compareSync(password, user.password)) {
    const email = user.email;
    return res.status(statusCode.SUCCESS).json({
      msg: "Login successful",
      data: {
        access_token: jwt.sign({ email }, process.env.JWT_SECRET),
      },
    });
  }

  return res
    .status(statusCode.BAD_REQUEST)
    .send("Email/Username or password is incorrect");
}

module.exports = {
  login,
};
