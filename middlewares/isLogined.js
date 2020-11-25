const { statusCode } = require("../utils")

const isLogined = (req, res, next) => {
  if (!req.user)
    return res.status(statusCode.FORBIDDEN).send("You haven't logined");
  next();
}

module.exports = isLogined;