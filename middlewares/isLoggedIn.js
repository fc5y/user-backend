const { statusCode } = require("../utils");

const isLoggedIn = (req, res, next) => {
  if (!req.user)
    return res.status(statusCode.FORBIDDEN).send("You haven't logged in");
  next();
};

module.exports = isLoggedIn;
