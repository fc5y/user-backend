'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Participations", "contest_password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn("Participations", "contest_password");
  }
};
