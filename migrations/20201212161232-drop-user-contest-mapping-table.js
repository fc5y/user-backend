'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // It is safe to drop a non-existent table
    await queryInterface.dropTable("UserContestMappings");
  },

  down: async (queryInterface, Sequelize) => {
    // Do nothing
  }
};
