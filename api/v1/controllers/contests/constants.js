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
  GET_CONTESTS_ERROR: {
    code: 3103,
    msg: "Cannot get contests",
  },
};

const DEFAULT_MESSAGE = {
  GET_ALL_CONTESTS: "Contests",
  CREATE_CONTEST: "Contest created",
};

module.exports = {
  MAX_LIMIT_GET_ALL_CONTESTS,
  ERRORS,
  DEFAULT_MESSAGE,
};
