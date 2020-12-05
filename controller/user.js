const { getIdParam, statusCode, expiredAfter } = require("../utils");
const db = require("../models/index.js");
const models = db.sequelize.models;

const jsonwebtoken = require("jsonwebtoken");

const SALT_ROUNDS = 10;
const bcrypt = require("bcryptjs");
const errors = require("../utils/error");

require("dotenv").config({ silent: true });

function buildUserJson(user) {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    school_name: user.school_name,
    email: user.email,
    is_email_verified: user.is_email_verified,
  };
}

function sanitizeUserDetails(data) {
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashedPassword = bcrypt.hashSync(data.password, salt);
  let userDetails = {
    username: data.username,
    full_name: data.full_name,
    email: data.email,
    school_name: data.school_name,
    password: hashedPassword,
    avatar: data.avatar,
    is_email_verified: data.is_email_verified,
  };
  return userDetails;
}

async function getAll(req, res) {
  let filter = {};
  let hasProperty = false;
  const attrs = ["full_name", "school_name", "email"];
  attrs.forEach((param) => {
    if (Object.prototype.hasOwnProperty.call(req.query, param)) {
      filter[param] = req.query[param];
      hasProperty = true;
    }
  });
  if (hasProperty) {
    const users = await models.User.findAll({
      attributes: [
        "id",
        "username",
        "full_name",
        "school_name",
        "email",
        "is_email_verified",
      ],
      where: filter,
    });
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "",
      data: { users: users },
    });
  } else {
    const users = await models.User.findAll({
      attributes: [
        "id",
        "username",
        "full_name",
        "school_name",
        "email",
        "is_email_verified",
      ],
    });
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "",
      data: { users: users },
    });
  }
}

async function getById(req, res) {
  const user_id = !req.params.id ? req.user.id : getIdParam(req);
  const user = await models.User.findByPk(user_id);
  if (user) {
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "",
      data: { user: buildUserJson(user) },
    });
  } else {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }
}

async function create(req, res) {
  if (req.body.id) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(
        `Bad request: ID should not be provided, since it is determined automatically by the database.`
      );
  } else {
    const user = await models.User.create(sanitizeUserDetails(req.body));
    res.status(statusCode.SUCCESS).json(buildUserJson(user));
  }
}

async function createVerifyToken(req, res) {
  const id = getIdParam(req);
  models.User.findByPk(id).then((user) => {
    jsonwebtoken.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: expiredAfter,
      },
      (err, token) => {
        if (err) {
          res.status(statusCode.BAD_REQUEST).send({
            code: 3005,
            msg: err.name,
            data: {},
          });
        } else {
          models.User.update(
            { verify_token: token },
            {
              where: { id: id },
            }
          ).then((rowsUpdate) => {
            if (rowsUpdate[0] === 0) {
              res.status(statusCode.BAD_REQUEST).send({
                code: 2001,
                msg: "User not found",
                data: {},
              });
            } else {
              res.status(statusCode.SUCCESS).send({
                code: 0,
                msg: "Success",
                data: { id: id, verify_token: token },
              });
            }
          });
        }
      }
    );
  });
}

async function verifyAccount(req, res) {
  const id = getIdParam(req);
  const token = req.query.token;
  models.User.findByPk(id).then((user) => {
    if (user.is_email_verified) {
      res.status(statusCode.BAD_REQUEST).json({
        code: 3001,
        msg: "Account had been verified!",
        data: {},
      });
    } else {
      if (user.verify_token !== token) {
        res.status(statusCode.BAD_REQUEST).send({
          code: 3005,
          msg: "Invalid token",
          data: {},
        });
      } else {
        jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            res.status(statusCode.BAD_REQUEST).send({
              code: 3001,
              msg: "Token has expired",
            });
          } else {
            if (decoded.email !== user.email) {
              res.status(statusCode.BAD_REQUEST).send({
                code: 3005,
                msg: "Invalid token",
                data: {},
              });
            } else {
              models.User.update(
                { is_email_verified: true },
                { where: { id: id } }
              ).then((rowsUpdate) => {
                if (rowsUpdate[0] === 0) {
                  res.status(statusCode.BAD_REQUEST).send({
                    code: 2001,
                    msg: "User not found",
                  });
                } else {
                  models.User.findByPk(id).then((updatedUser) => {
                    res.status(statusCode.SUCCESS).send({
                      code: 0,
                      msg: "Success",
                      data: buildUserJson(updatedUser),
                    });
                  });
                }
              });
            }
          }
        });
      }
    }
  });
}

async function update(req, res, next) {
  const id = getIdParam(req);
  if (!req.body.id) {
    throw new errors.FcError(errors.MISSING_USER_ID);
  } else {
    models.User.update(req.body, {
      where: { id: id },
    })
      .then((rowsUpdate) => {
        if (rowsUpdate[0] == 0) {
          throw new errors.FcError(errors.USER_NOT_FOUND);
        } else {
          models.User.findByPk(id).then((user) => {
            res.status(statusCode.SUCCESS).json({
              code: 0,
              msg: "",
              data: { user: buildUserJson(user) },
            });
          });
        }
      })
      .catch(next);
  }
}

async function remove(req, res) {
  const id = getIdParam(req);
  await models.user.destroy({
    where: {
      id: id,
    },
  });
  res.status(statusCode.SUCCESS).end();
}

module.exports = {
  getAll,
  getById,
  create,
  createVerifyToken,
  verifyAccount,
  update,
  remove,
};
