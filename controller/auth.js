const db = require("../models/index.js");
const models = db.sequelize.models;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config({ slient: true });

async function login (req, res) {
  if (req.user)
    return res.status(400).send("Already signed in");
  
  let { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email or password is incorrect");

  let users = await models.User.findOne({ where: { email } });
  if (!users)
    return res.status(400).send("Email or password is incorrect");

  if (bcrypt.compareSync(password, users.password))
  {
    return res.status(200).json({
      msg: "Login successful",
      data:
      {
        access_token: jwt.sign({ email }, process.env.JWT_SECRET)
      }
    })
  }

  return res.status(400).send("Email or password is incorrect");
}

module.exports = {
  login
}