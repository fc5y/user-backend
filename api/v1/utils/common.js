const { validationResult } = require("express-validator");
const { ERRORS } = require("../constants");
const { LogicError } = require("./errors");

const DISABLE_REQUIRE_ADMIN_ROLE = false;

function requireAdminRole(req, res, next) {
  if (DISABLE_REQUIRE_ADMIN_ROLE) {
    return next();
  }
  const username = req.user && req.user.username;
  const isAdmin = username === "admin"; // TODO: improve this
  if (!isAdmin) {
    throw new LogicError({ ...ERRORS.ADMIN_ROLE_REQUIRED, data: { username } });
  } else {
    return next();
  }
}

// throw errors if validation error found
function validationMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new LogicError({ ...ERRORS.VALIDATION_FAILED, data: errors });
  } else {
    return next();
  }
}

function dateToTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

function timestampToDate(timestamp) {
  return new Date(timestamp * 1000);
}

function getTimestampNow() {
  return dateToTimestamp(new Date());
}

module.exports = {
  requireAdminRole,
  validationMiddleware,
  dateToTimestamp,
  timestampToDate,
  getTimestampNow,
};
