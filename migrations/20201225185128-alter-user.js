"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Users", "is_email_verified", {
          transaction: t,
        }),
        queryInterface.removeColumn("Users", "verify_token", {
          transaction: t,
        }),
        queryInterface.removeColumn("Users", "verify_token_expired_at", {
          transaction: t,
        }),
      ]);
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Users",
          "is_email_verified",
          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          { transaction: t },
        ),
        queryInterface.addColumn(
          "Users",
          "verify_token",
          { type: Sequelize.STRING, allowNull: true },
          { transaction: t },
        ),
        queryInterface.addColumn(
          "Users",
          "verify_token_expired_at",
          { type: Sequelize.DATE, allowNull: true },
          { transaction: t },
        ),
      ]);
    });
  },
};
