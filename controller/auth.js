const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ slient: true });

const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode, emailRegex } = require("../utils");
const errors = require("../utils/error");

function isEmail(email_or_username) {
  return emailRegex.test(email_or_username);
}

async function login(req, res) {
  if (req.user) {
    return res.status(statusCode.SUCCESS).json({
      code: 0,
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
    throw new errors.FcError(errors.MISSING_REQUIRED_FIELDS);
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
    throw new errors.FcError(errors.EMAIL_USERNAME_PASSWORD_INVALID);
  }

  if (bcrypt.compareSync(password, user.password)) {
    const email = user.email;
    return res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "Login successful",
      data: {
        access_token: jwt.sign({ email }, process.env.JWT_SECRET),
      },
    });
  }

  throw new errors.FcError(errors.EMAIL_USERNAME_PASSWORD_INVALID);
}

module.exports = {
  login,
};
