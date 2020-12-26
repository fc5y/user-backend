const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userData = require("../data/users");
const authData = require("../data/auth");
const authUtils = require("../utils/auth");
const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

async function sendOtp({ email }) {
  const expired_time = new Date(new Date().getTime() + 10 * 60000); // 10 minutes later
  const otp = authUtils.generateOtp();
  await authData.upsertEmailVerification({ email, otp, expired_time });
  await authUtils.sendOtpEmail({ email, otp });
}

async function login({ email_or_username, password }) {
  console.log(email_or_username);
  const user = email_or_username.includes("@")
    ? await userData.findOneByEmail(email_or_username)
    : await userData.findOneByUsername(email_or_username);
  if (!user) {
    throw new LogicError(ERRORS.USER_NOT_FOUND);
  }
  if (await bcrypt.compare(password, user.password)) {
    return {
      access_token: jwt.sign(
        {
          email: user.email,
          id: user.id,
          username: user.username,
        },
        process.env.JWT_SECRET,
      ),
    };
  } else {
    throw new LogicError(ERRORS.EMAIL_USERNAME_PASSWORD_INVALID);
  }
}

async function signup({
  email,
  username,
  otp,
  password,
  full_name,
  school_name,
}) {
  // 1. Make sure that email and username are not used
  if (await userData.findOneByEmail(email)) {
    throw new LogicError(ERRORS.EMAIL_EXISTS);
  }
  if (await userData.findOneByUsername(username)) {
    throw new LogicError(ERRORS.USERNAME_EXISTS);
  }

  // 2. Make sure that otp is valid and not expired
  const emailVerification = await authData.findEmailVerificationByEmail(email);
  if (emailVerification === null) {
    throw new LogicError(ERRORS.OTP_INVALID);
  }
  if (emailVerification.expired_time < new Date()) {
    throw new LogicError(ERRORS.OTP_EXPIRED);
  }
  if (emailVerification.otp !== otp) {
    throw new LogicError(ERRORS.OTP_INVALID);
  }

  // 3. Generate hashed password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // 4. Create user
  const user = await userData.createOne({
    email,
    username,
    otp,
    password: hashedPassword,
    full_name,
    school_name,
  });

  // 5. Invalidate OTP
  await emailVerification.destroy();

  return { user };
}

module.exports = {
  sendOtp,
  login,
  signup,
};
