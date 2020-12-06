const { statusCode } = require("../utils");

const isNotLoggedIn = (req, res, next) => {
  if (req.user)
    return res.status(statusCode.FORBIDDEN).send("You must logout to continue");
  next();
};

module.exports = isNotLoggedIn;
