"use strict";

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TABLE Users ADD COLUMN username VARCHAR(50) NOT NULL UNIQUE;"
    );
  },

  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeColumn("Users", "username");
  },
};
