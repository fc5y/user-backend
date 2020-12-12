"use strict";

/*
Changes

1. Rename `name` to `contest_name`
2. Rename `description` to `contest_title`
3. Rename `length_in_second` to `duration`
4. Add `can_enter`
5. Add `materials`
*/

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Rename `name` to `contest_name`
    await queryInterface.renameColumn("Contests", "name", "contest_name");

    // 2. Rename `description` to `contest_title`
    await queryInterface.renameColumn(
      "Contests",
      "description",
      "contest_title",
    );

    // 3. Rename `length_in_second` to `duration`
    await queryInterface.renameColumn(
      "Contests",
      "length_in_second",
      "duration",
    );

    // 4. Add `can_enter`
    await queryInterface.addColumn("Contests", "can_enter", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    // 5. Add `materials`
    await queryInterface.addColumn("Contests", "materials", {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 5. Revert: Add `materials`
    await queryInterface.removeColumn("Contests", "materials");

    // 4. Revert: Add `can_enter`
    await queryInterface.removeColumn("Contests", "can_enter");

    // 3. Revert: Rename `length_in_second` to `duration`
    await queryInterface.renameColumn(
      "Contests",
      "duration",
      "length_in_second",
    );

    // 2. Revert: Rename `description` to `contest_title`
    await queryInterface.renameColumn(
      "Contests",
      "contest_title",
      "description",
    );

    // 1. Revert: Rename `name` to `contest_name`
    await queryInterface.renameColumn("Contests", "contest_name", "name");
  },
};
