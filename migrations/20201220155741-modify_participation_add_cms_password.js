'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Participations", "cms_password", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn("Participations", "cms_password");
  }
};
