const { sequelize } = require("../../../models");

async function findOneByEmail({ email }) {
  return await sequelize.models.User.findOne({
    where: { email },
  });
}

async function findOneByUsername({ username }) {
  return await sequelize.models.User.findOne({
    where: { username },
  });
}

async function findOneById(user_id) {
  return await sequelize.models.User.findOne({
    where: {id: user_id}
  });
}

async function createOne({
  email,
  username,
  otp,
  password,
  full_name,
  school_name,
}) {
  const user = await sequelize.models.User.create({
    email,
    username,
    otp,
    password,
    full_name,
    school_name,
  });
  return user;
}

module.exports = {
  findOneByEmail,
  findOneByUsername,
  findOneById,
  createOne,
};
