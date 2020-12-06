const jwt = require("jsonwebtoken");
require("dotenv").config({ slient: true });

const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode, emailRegex } = require("../utils");
const errors = require("../utils/error");
const { buildUserJson } = require("./user");

const SALT_ROUNDS = 10;
const bcrypt = require("bcryptjs");
const otpGenerator = require("otp-generator");
const { updateOrCreate } = require("../utils/models.js");

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

async function sendOtp(req, res) {
  if (!req.body.email) {
    throw new errors.FcError(errors.MISSING_EMAIL);
  }
  const existing_email = await models.User.findOne({
    where: { email: req.body.email },
  });
  if (existing_email) {
    throw new errors.FcError(errors.EMAIL_EXISTED);
  }
  const otp = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });
  const now = new Date();
  const expired_time = new Date(now.getTime() + 10 * 60000); // 10 minutes later
  updateOrCreate(
    models.EmailVerification,
    { email: req.body.email },
    {
      email: req.body.email,
      otp: otp,
      expired_time: expired_time,
    }
  )
    .then(function (_result) {
      return res.status(statusCode.SUCCESS).send({
        code: 0,
        msg: "OTP sent",
        data: {},
      });
    })
    .catch(function (_err) {
      throw new errors.FcError(errors.SYSTEM_ERROR);
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

async function releaseOtp(otp) {
  await models.EmailVerification.destroy({
    where: {
      otp: otp,
    },
  });
}

async function signup(req, res) {
  const required_params = ["email", "otp", "full_name", "username"];
  required_params.forEach((param) => {
    if (!Object.prototype.hasOwnProperty.call(req.body, param)) {
      throw new errors.FcError(errors.MISSING_REQUIRED_FIELDS);
    }
  });
  // check existing email
  const existing_email = await models.User.findOne({
    where: {
      email: req.body.email,
    },
  });
  if (existing_email) {
    throw new errors.FcError(errors.EMAIL_EXISTED);
  }
  // check existing username
  const existing_username = await models.User.findOne({
    where: {
      username: req.body.username,
    },
  });
  if (existing_username) {
    throw new errors.FcError(errors.USERNAME_EXISTED);
  }

  // check OTP
  await checkOtp(req);

  await releaseOtp(req.body.otp);

  const user = await models.User.create(sanitizeUserDetails(req.body));
  if (!user) throw new errors.FcError(errors.MISSING_REQUIRED_FIELDS);

  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "Create user successful",
    data: buildUserJson(user),
  });
}

module.exports = {
  login,
  signup,
  sendOtp,
};
