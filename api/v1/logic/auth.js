const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userData = require("../data/users");
const authData = require("../data/auth");
const authUtils = require("../utils/auth");
const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

async function sendOtp({ email }) {
  // 1. Ensure OTP send rate
  if (authUtils.rateLimiters.sendOtpOverall.isFull("")) {
    throw new LogicError(ERRORS.OTP_SEND_LIMIT_OVERALL_EXCEEDED);
  }
  if (authUtils.rateLimiters.sendOtpPerEmail.isFull(email)) {
    throw new LogicError(ERRORS.OTP_SEND_LIMIT_PER_EMAIL_EXCEEDED);
  }
  authUtils.rateLimiters.sendOtpOverall.push("");
  authUtils.rateLimiters.sendOtpPerEmail.push(email);

  // 2. Generate and send OTP
  const expired_time = new Date(new Date().getTime() + 10 * 60000); // 10 minutes later
  const otp = authUtils.generateOtp();
  await authData.upsertEmailVerification({ email, otp, expired_time });
  await authUtils.sendOtpEmail({ email, otp });
}

async function login({ email_or_username, password }) {
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

  // 2. Ensure OTP verify rate
  if (authUtils.rateLimiters.verifyOtpPerEmail.isFull(email)) {
    throw new LogicError(ERRORS.OTP_VERIFY_LIMIT_PER_EMAIL_EXCEEDED);
  }
  authUtils.rateLimiters.verifyOtpPerEmail.push(email);

  // 3. Make sure that otp is valid and not expired
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

  // 4. Generate hashed password
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);

  // 5. Create user
  const user = await userData.createOne({
    email,
    username,
    otp,
    password: hashedPassword,
    full_name,
    school_name,
  });

  // 6. Invalidate OTP
  await emailVerification.destroy();

  return { user };
}

module.exports = {
  sendOtp,
  login,
  signup,
};
