const { statusCode } = require("../utils");
const { FcError, LOGIN_REQUIRED } = require("../utils/error");
const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = new FcError(LOGIN_REQUIRED);
    res.status(statusCode.FORBIDDEN).send({
      code: error.code,
      msg: error.msg,
      data: error.data || {},
    });
  }
  next();
};

module.exports = isLoggedIn;
