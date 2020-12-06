const errors = require("../utils/error");

const isNotUser = (req, res, next) => {
  if (req.user) throw new errors.FcError(errors.LOGOUT_REQUIRED);
  next();
};

module.exports = isNotUser;
