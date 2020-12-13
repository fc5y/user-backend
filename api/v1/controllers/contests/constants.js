const MAX_LIMIT_GET_ALL_CONTESTS = 50;

const ERRORS = {
  BAD_REQUEST: {
    code: 1001,
    msg: "Bad request",
  },
  CONTEST_EXISTS: {
    code: 3101,
    msg: "Contest already exists",
  },
  CREATE_CONTEST_ERROR: {
    code: 3102,
    msg: "Cannot create contest",
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

const DEFAULT_MESSAGE = {
  GET_ALL_CONTESTS: "Contests",
  CREATE_CONTEST: "Contest created",
  GET_CONTEST: "Contest",
  UPDATE_CONTEST: "Contest updated",
};

module.exports = {
  MAX_LIMIT_GET_ALL_CONTESTS,
  ERRORS,
  DEFAULT_MESSAGE,
};
