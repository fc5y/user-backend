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
  OTP_SEND_LIMIT_PER_EMAIL_EXCEEDED: {
    code: 3010,
    msg: "OTP send limit exceeded (per email)",
  },
  OTP_SEND_LIMIT_OVERALL_EXCEEDED: {
    code: 3011,
    msg: "OTP send limit exceeded (system)",
  },
  OTP_VERIFY_LIMIT_PER_EMAIL_EXCEEDED: {
    code: 3012,
    msg: "OTP verify limit exceeded (per email)",
  },
  CANNOT_ENTER_CONTEST: {
    code: 3103,
    msg: "Can not enter this contest",
  },
  NOT_REGISTERED_YET: {
    code: 3201,
    msg: "Not registered yet",
  },
  NOT_SYNCED_YET: {
    code: 3202,
    msg: "Not synced yet",
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
