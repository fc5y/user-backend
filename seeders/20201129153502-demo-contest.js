"use strict";

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert("Contests", [
      {
        name: "Free Contest 1",
        start_time: new Date(2020, 12, 24, 10, 33, 30),
        length_in_second: 5 * 3600,
        description: "Test description",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete("Contests", null, {});
  },
};
