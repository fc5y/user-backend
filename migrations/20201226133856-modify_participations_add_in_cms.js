'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("Participations", "in_cms", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    });
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn("Participations", "in_cms");
  }
};
