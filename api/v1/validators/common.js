const { validationResult } = require("express-validator");
const { ERRORS } = require("../constants");
const { LogicError } = require("../utils/errors");

function requireAdminRole(req, res, next) {
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

module.exports = {
  requireAdminRole,
  validationMiddleware,
};
