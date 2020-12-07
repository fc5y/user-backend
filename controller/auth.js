const jwt = require("jsonwebtoken");
require("dotenv").config({ slient: true });

const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode, emailRegex } = require("../utils");
const errors = require("../utils/error");
const { buildUserJson } = require("./user");

const SALT_ROUNDS = 10;
const bcrypt = require("bcryptjs");

function isEmail(email_or_username) {
  return emailRegex.test(email_or_username);
}

function sanitizeUserDetails(data) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(data.password, salt);
  let userDetails = {
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    school_name: data.school_name,
    password: hashedPassword,
    avatar: data.avatar,
    is_email_verified: data.is_email_verified,
  };
  return userDetails;
}

async function login(req, res) {
  if (req.user) {
    return res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "Already logged in",
      data: {
        access_token: jwt.sign(
          {
            email: req.user.email,
            id: user.id,
          },
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
    return res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "Login successful",
      data: {
        access_token: jwt.sign(
          {
            email: user.email,
            id: user.id,
          },
          process.env.JWT_SECRET
        ),
      },
    });
  }
  throw new errors.FcError(errors.EMAIL_USERNAME_PASSWORD_INVALID);
}

async function signup(req, res) {
  const { email, username, full_name, school_name, password } = req.body;

  if (!email || !username || !full_name || !school_name || !password)
    throw new errors.FcError(errors.MISSING_REQUIRED_FIELDS);
  if (await models.User.findOne({ username }))
    throw new errors.FcError(errors.USERNAME_EXISTS);
  if (await models.User.findOne({ email }))
    throw new errors.FcError(errors.EMAIL_EXISTS);

  const user = await models.User.create(sanitizeUserDetails(req.body));

  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "Create user successful",
    data: buildUserJson(user),
  });
}

module.exports = {
  login,
  signup,
};
