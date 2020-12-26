const ERRORS = {
  BAD_REQUEST: {
    code: 1001,
    msg: "Bad request",
  },
  VALIDATION_FAILED: {
    code: 1009,
    msg: "Validation failed",
  },
  CONTEST_EXISTS: {
    code: 3101,
    msg: "Contest already exists",
  },
  CREATE_CONTEST_ERROR: {
    code: 3102,
    msg: "Cannot create contest",
  },
  USER_NOT_FOUND: {
    code: 2001,
    msg: "User not found",
  },
  CONTEST_NOT_FOUND: {
    code: 2101,
    msg: "Contest not found",
  },
  LOGIN_REQUIRED: {
    code: 3001,
    msg: "Login required",
  },
  USERNAME_EXISTS: {
    code: 3002,
    msg: "Username already exists",
  },
  EMAIL_EXISTS: {
    code: 3003,
    msg: "Email already exists",
  },
  EMAIL_USERNAME_PASSWORD_INVALID: {
    code: 3006,
    msg: "Email/Username or password is invalid",
  },
  OTP_INVALID: {
    code: 3008,
    msg: "OTP invalid",
  },
  OTP_EXPIRED: {
    code: 3009,
    msg: "OTP expired",
  },
  NOT_REGISTERED_YET: {
    code: 3201,
    msg: "Not registered yet",
  },
  ADMIN_ROLE_REQUIRED: {
    code: 3300,
    msg: "Admin role required",
  },
  SERVER_ERROR: {
    code: 4000,
    msg: "Server error",
  },
};

module.exports = {
  ERRORS,
};
