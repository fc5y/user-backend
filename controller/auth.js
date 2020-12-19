require("dotenv").config();

const jwt = require("jsonwebtoken");
const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode, emailRegex } = require("../utils");
const errors = require("../utils/error");

const SALT_ROUNDS = 10;
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const { updateOrCreate } = require("../utils/models.js");
const { createMessage, sendMail } = require("../utils/email-sender");
const userController = require("./user");

function isEmail(email_or_username) {
  return emailRegex.test(email_or_username);
}

function getHashedPassword(password) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  return bcrypt.hashSync(password, salt);
}

function sanitizeUserDetails(data) {
  const hashedPassword = getHashedPassword(data.password);
  const userDetails = {
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
          process.env.JWT_SECRET,
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
          process.env.JWT_SECRET,
        ),
      },
    });
  }
  throw new errors.FcError(errors.EMAIL_USERNAME_PASSWORD_INVALID);
}

async function sendOtp(req, res) {
  if (!req.body.email) {
    throw new errors.FcError(errors.MISSING_EMAIL);
  }

  if (await models.User.findOne({ where: { email: req.body.email } })) {
    throw new errors.FcError(errors.EMAIL_EXISTS);
  }

  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const now = new Date();
  const expired_time = new Date(now.getTime() + 10 * 60000); // 10 minutes later
  await updateOrCreate(
    models.EmailVerification,
    { email: req.body.email },
    {
      email: req.body.email,
      otp: otp,
      expired_time: expired_time,
    },
  );
  const message = createMessage(
    req.body.email,
    "Email verification",
    "OTP: " + otp,
  );
  await sendMail(message);
  return res.status(statusCode.SUCCESS).send({
    code: 0,
    msg: "Sent OTP successfully",
    data: {},
  });
}

async function checkOtp(req) {
  if (!req.body.email || !req.body.otp) {
    throw new errors.FcError(errors.OTP_INVALID);
  }
  const emailVerification = await models.EmailVerification.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (!emailVerification || emailVerification.otp != req.body.otp) {
    throw new errors.FcError(errors.OTP_INVALID);
  }
  const now = new Date();
  if (emailVerification.expired_time < now) {
    throw new errors.FcError(errors.OTP_EXPIRED);
  }
  return true;
}

async function releaseOtp(email) {
  await models.EmailVerification.destroy({
    where: { email: email },
  });
}

async function signup(req, res) {
  const { email, username, full_name, password, otp } = req.body;
  if (!email || !username || !full_name || !otp || !password) {
    throw new errors.FcError(errors.MISSING_REQUIRED_FIELDS);
  }
  if (await models.User.findOne({ where: { username } })) {
    throw new errors.FcError(errors.USERNAME_EXISTS);
  }

  if (await models.User.findOne({ where: { email } })) {
    throw new errors.FcError(errors.EMAIL_EXISTS);
  }

  // check OTP
  await checkOtp(req);

  await releaseOtp(email);

  const user = await models.User.create(sanitizeUserDetails(req.body));

  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "User created",
    data: userController.formatUser(user, true),
  });
}

module.exports = {
  login,
  signup,
  sendOtp,
  getHashedPassword,
};
