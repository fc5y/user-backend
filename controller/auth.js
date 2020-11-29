const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config({ slient: true });

const db = require("../models/index.js");
const models = db.sequelize.models;
const { statusCode } = require("../utils");

async function login(req, res) {
  if (req.user)
    return res.status(statusCode.SUCCESS).json({
      msg: "Already logged in",
      data: {
        access_token: jwt.sign(
          { email: req.user.email },
          process.env.JWT_SECRET
        ),
      },
    });

  let { email, password } = req.body;
  if (!email || !password)
    return res
      .status(statusCode.BAD_REQUEST)
      .send("Email or password is incorrect");

  let users = await models.User.findOne({ where: { email } });
  if (!users)
    return res
      .status(statusCode.BAD_REQUEST)
      .send("Email or password is incorrect");

  if (bcrypt.compareSync(password, users.password)) {
    return res.status(statusCode.SUCCESS).json({
      msg: "Login successful",
      data: {
        access_token: jwt.sign({ email }, process.env.JWT_SECRET),
      },
    });
  }

  return res
    .status(statusCode.BAD_REQUEST)
    .send("Email or password is incorrect");
}

module.exports = {
  login,
};
