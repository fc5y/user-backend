const { validationResult } = require("express-validator");
const { ERRORS } = require("../constants");
const { LogicError } = require("./errors");

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
  return date.getTime() / 1000;
}

function timestampToDate(timestamp) {
  return new Date(timestamp * 1000);
}

module.exports = {
  dateToTimestamp,
  timestampToDate,
  validationMiddleware,
};
