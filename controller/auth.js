const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ slient: true });

const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode } = require("../utils");
var otpGenerator = require("otp-generator");
const { updateOrCreate } = require("../utils/models.js");
const userController = require("./user");
const SALT_ROUNDS = 10;

async function login(req, res) {
  if (req.user)
    return res.status(statusCode.SUCCESS).json({
      msg: "Already logged in",
      data: {
        access_token: jwt.sign(
          { email: req.user.email },
          process.env.JWT_SECRET
        ),
      },
    });

  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(statusCode.BAD_REQUEST)
      .send("Email or password is incorrect");

  let users = await models.User.findOne({ where: { email } });
  if (!users)
    return res
      .status(statusCode.BAD_REQUEST)
      .send("Email or password is incorrect");

  if (bcrypt.compareSync(password, users.password)) {
    return res.status(statusCode.SUCCESS).json({
      msg: "Login successful",
      data: {
        access_token: jwt.sign({ email }, process.env.JWT_SECRET),
      },
    });
  }

  return res
    .status(statusCode.BAD_REQUEST)
    .send("Email or password is incorrect");
}

async function sendOtp(req, res) {
  if (!req.body.email) {
    return res.status(statusCode.BAD_REQUEST).send("Email is invalid");
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
    .then(function (result) {
      console.log(result);
      return res.status(statusCode.SUCCESS).send("OTP sent");
    })
    .catch(function (err) {
      console.log(err);
      return res.status(statusCode.SUCCESS).send(err.message);
    });
}

async function checkOtp(req) {
  if (!req.body.email || !req.body.otp) {
    return false;
  }
  const emailVerification = await models.EmailVerification.findOne({
    email: req.body.email,
  });
  if (!emailVerification || emailVerification.otp != req.body.otp) {
    return false;
  }
  return true;
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

async function signup(req, res) {
  if (req.body.id) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(
        `Bad request: ID should not be provided, since it is determined automatically by the database.`
      );
  } else {
    // check OTP
    const validOtp = await checkOtp(req);
    if (!validOtp) {
      res.status(statusCode.SUCCESS).send("OTP is invalid");
    }
    const user = await models.User.create(sanitizeUserDetails(req.body));
    res.status(statusCode.SUCCESS).json(userController.buildUserJson(user));
  }
}

module.exports = {
  login,
  sendOtp,
  signup,
};
