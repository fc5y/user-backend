const { sequelize } = require("../../../models");

async function findOneByEmail(email) {
  return await sequelize.models.User.findOne({
    where: { email },
  });
}

async function findOneByUsername(username) {
  return await sequelize.models.User.findOne({
    where: { username },
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
  createOne,
};
