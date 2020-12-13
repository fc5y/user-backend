require("dotenv").config();

const { getIdParam, statusCode, expiredAfter } = require("../utils");
const db = require("../models/index.js");
const models = db.sequelize.models;
const jsonwebtoken = require("jsonwebtoken");
const errors = require("../utils/error");
const bcrypt = require("bcryptjs");
const { getHashedPassword } = require("./auth.js");

function formatUser(user) {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    school_name: user.school_name,
    email: user.email,
    rank_in_global: 0,
    rating: 0
  };
}

async function getUserByUsername(req, res) {
  const username = req.params;
  const user = await models.User.findOne({ where: username });
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  } else {
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "User",
      data: {
        user: formatUser(user)
      },
    });
  }
}

async function update(req, res, next) {
  const user_id = req.user.id;
  const user = await models.User.findByPk(user_id);
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }

  if (req.body.full_name !== undefined) user.full_name = req.body.full_name;
  if (req.body.school_name !== undefined) user.school_name = req.body.school_name;
  user.save().then(updatedUser => {
    if (!updatedUser) {
      throw new errors.FcError(errors.SYSTEM_ERROR);
    }
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "User updated",
      data: { user: buildUserJson(updatedUser) },
    });
  });
}

async function changePassword(req, res, next) {	
  const user_id = req.user.id;	
  const user = await models.User.findByPk(user_id);	
  if (!user) {	
    throw new errors.FcError(errors.USER_NOT_FOUND);	
  }	

  if (!bcrypt.compareSync(req.body.old_password, user.password)) {	
    throw new errors.FcError(errors.EMAIL_USERNAME_PASSWORD_INVALID);	
  }	

  const hashedPassword = getHashedPassword(req.body.new_password);	
  user.password = hashedPassword;
  user.save().then((updatedUser) => {
    if (!updatedUser) {
      throw new errors.FcError(errors.SYSTEM_ERROR);
    }
    res.status(statusCode.SUCCESS).json({	
      code: 0,	
      msg: "Password updated",	
      data: {},	
    });
  }).catch(next);
}

module.exports = {
  formatUser,
  getUserByUsername,
  changePassword,
  update,
};
