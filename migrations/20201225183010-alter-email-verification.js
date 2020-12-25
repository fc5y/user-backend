"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint("EmailVerifications", {
      fields: ["email"],
      type: "unique",
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint("EmailVerifications", {
      fields: ["email"],
      type: "unique",
    });
  },
};
