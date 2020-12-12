require("dotenv").config();

const { getIdParam, statusCode, expiredAfter } = require("../utils");
const db = require("../models/index.js");
const models = db.sequelize.models;
const jsonwebtoken = require("jsonwebtoken");
const errors = require("../utils/error");

function buildUserJson(user) {
  return {
    id: user.id,
    username: user.username,
    full_name: user.full_name,
    school_name: user.school_name,
    rank_in_global: 0,
    rating: 0
  };
}

async function getAll(req, res) {
  let filter = {};
  const attrs = ["full_name", "school_name"];
  attrs.forEach((param) => {
    if (Object.prototype.hasOwnProperty.call(req.query, param)) {
      filter[param] = req.query[param];
    }
  });
  const users = await models.User.findAll({
    where: filter,
  });
  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "",
    data: {
      users: users.map(user => buildUserJson(user))
    },
  });
}

async function getByUsername(req, res) {
  const username = req.params;
  const user = await models.User.findOne({ where: username });
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  } else {
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "",
      data: {
        user: buildUserJson(user)
      },
    });
  }
}

async function getById(req, res) {
  const user_id = !req.params.id ? req.user.id : getIdParam(req);
  const user = await models.User.findByPk(user_id);
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  } else {
    res.status(statusCode.SUCCESS).json({
      code: 0,
      msg: "",
      data: {
        user: buildUserJson(user)
      },
    });
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
            },
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
      },
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
                { where: { id: id } },
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

async function update(req, res) {
  const user_id = req.user.id;
  const user = await models.User.findByPk(user_id);
  if (!user) {
    throw new errors.FcError(errors.USER_NOT_FOUND);
  }
  
  const rowsChange = await models.User.update({
    full_name: req.body.full_name,
    school_name: req.body.school_name
  }, {
    where: { id: user_id },
  });

  if (!rowsChange[0]) {
    throw new errors.FcError(errors.SYSTEM_ERROR);
  }

  const updatedUser = await models.User.findByPk(user_id);

  res.status(statusCode.SUCCESS).json({
    code: 0,
    msg: "User updated",
    data: { user: buildUserJson(updatedUser) },
  });
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
  // Users
  buildUserJson,
  getAll,
  getByUsername,
  getById,
  // Auth
  createVerifyToken,
  verifyAccount,
  update,
  remove,
};
