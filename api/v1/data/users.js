const { sequelize } = require("./../../../models");

async function findOneByUsername({ username }) {
  return await sequelize.models.User.findOne({
    where: {username: username}
  });
}

async function findOneById(user_id) {
  return await sequelize.models.User.findOne({
    where: {id: user_id}
  });
}

module.exports = {
    findOneByUsername,
    findOneById,
};
