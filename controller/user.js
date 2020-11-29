const { getIdParam, statusCode } = require("../utils");
const db = require("../models/index.js");
const models = db.sequelize.models;

const jsonwebtoken = require("jsonwebtoken");

const saltRounds = 10;
const bcrypt = require("bcrypt");

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
  const salt = bcrypt.genSaltSync(saltRounds);
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
    res.status(statusCode.SUCCESS).json(users);
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
    res.status(statusCode.SUCCESS).json(users);
  }
}

async function getById(req, res) {
  const id = getIdParam(req);
  const user = await models.User.findByPk(id);
  if (user) {
    res.status(statusCode.SUCCESS).json(buildUserJson(user));
  } else {
    res.status(statusCode.NOT_FOUND).send("404 - Not found");
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
  const token = jsonwebtoken.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: "1800",
  });
  await models.User.update(
    { verify_token: createVerifyToken(id) },
    {
      where: { id: id },
    }
  );
  res.status(statusCode.SUCCESS).send({ token: token });
}

async function verifyAccount(req, res) {
  const token = req.body.token;
  jsonwebtoken.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(statusCode.BAD_REQUEST).send("Token has expired");
    } else {
      models.User.update(
        { is_email_verified: true },
        {
          where: { id: decoded.payload.id },
        }
      );
      res.status(statusCode.SUCCESS).send("OK");
    }
  });
}

async function update(req, res, next) {
  const id = getIdParam(req);
  if (req.body.id) {
    res
      .status(statusCode.BAD_REQUEST)
      .send(
        `Bad request: ID should not be provided, since it is determined automatically by the database.`
      );
  } else {
    await models.User.update(
      {
        full_name: req.body.full_name,
        school_name: req.body.school_name,
      },
      {
        where: { id: id },
      }
    )
      .then((rowsUpdate) => {
        if (rowsUpdate == 0) {
          res.status(statusCode.NOT_FOUND).send("User not found");
        }
      })
      .catch(next);

    const user = await models.User.findByPk(id);
    res.status(statusCode.SUCCESS).json(buildUserJson(user));
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
