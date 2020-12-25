const { sequelize } = require("./../../../models");

async function findOneByUsername({ username }) {
  return await sequelize.models.User.findOne({
    where: {username: username}
  });
}

module.exports = {
    findOneByUsername,
};
