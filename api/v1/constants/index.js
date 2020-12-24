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
  SERVER_ERROR: {
    code: 4000,
    msg: "Server error",
  },
};

module.exports = {
  ERRORS,
};
