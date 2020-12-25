const { sequelize } = require("./../../../models");

async function findOneByUsername({ username }) {
    console.log(sequelize.models.User);
  return await sequelize.models.User.findOne({
    where: {username: username}
  });
}

module.exports = {
    findOneByUsername,
};
