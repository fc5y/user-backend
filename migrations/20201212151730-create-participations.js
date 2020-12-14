'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Participations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
      },
      contest_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Contests",
          key: "id",
        },
      },
      rank_in_contest: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      rating_change: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      is_hidden: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.dropTable('Participations');
  }
};
