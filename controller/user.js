const { getIdParam, statusCode } = require("../utils");
const { createMessage, sendMail } = require("../utils/email-sender");
const db = require("../models/index.js");
const models = db.sequelize.models;

async function getAll(req, res) {
  const users = await models.User.findAll({
    attributes: [
      "id",
      "full_name",
      "school_name",
      "email",
      "is_email_verified",
    ],
  });
  res.status(statusCode.SUCCESS).json(users);
}

async function getById(req, res) {
  const id = getIdParam(req);
  const user = await models.User.findByPk(id);
  if (user) {
    res.status(statusCode.SUCCESS).json({
      id: user.id,
      full_name: user.full_name,
      school_name: user.school_name,
      email: user.email,
      is_email_verified: user.is_email_verified,
    });
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
    const user = await models.User.create(req.body);
    res.status(statusCode.SUCCESS).json({
      id: user.id,
      full_name: user.full_name,
      school_name: user.school_name,
      email: user.email,
      is_email_verified: user.is_email_verified,
    });
  }
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
    res.status(statusCode.SUCCESS).json({
      id: user.id,
      full_name: user.full_name,
      school_name: user.school_name,
      email: user.email,
      is_email_verified: user.is_email_verified,
    });
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

async function sendMailApi(req, res) {
  const message = createMessage(
    "Lam Do <admin@freecontest.net>",
    "Hello from Free Contest",
    "Say Hi from Freecontest",
    '<p><b>Hello</b> to myself <img src="cid:note@node"/></p>' +
      "<p>Here's a nyan cat for you as an embedded attachment:<br/></p>"
  );
  sendMail(message);
  res.status(statusCode.SUCCESS).end();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  sendMailApi,
};
