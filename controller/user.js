require("dotenv").config();

const { statusCode } = require("../utils");
const db = require("../models/index.js");
const models = db.sequelize.models;
const errors = require("../utils/error");
const bcrypt = require("bcryptjs");

function formatUser(user, publicFieldOnly = false) {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    school_name: user.school_name,
    ...(publicFieldOnly ? { email: user.email } : {}),
    rank_in_global: 0,
    rating: 0,
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
        user: formatUser(user),
      },
    });
  }
}

async function getUserById(req, res) {
  const user_id = req.user.id;
  const user = await models.User.findByPk(user_id);
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }
  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "User",
    data: {
      user: formatUser(user, true),
    },
  });
}

async function update(req, res, next) {
  const user_id = req.user.id;
  const user = await models.User.findByPk(user_id);
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }

  if (req.body.full_name !== undefined) user.full_name = req.body.full_name;
  if (req.body.school_name !== undefined)
    user.school_name = req.body.school_name;
  user.save().then((updatedUser) => {
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "User updated",
      data: { user: formatUser(updatedUser, true) },
    });
  });
}

function getHashedPassword(password) {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
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
  user
    .save()
    .then((updatedUser) => {
      res.status(statusCode.SUCCESS).json({
        code: 0,
        msg: "Password updated",
        data: {},
      });
    })
    .catch(next);
}

module.exports = {
  formatUser,
  getUserByUsername,
  getUserById,
  changePassword,
  update,
};
