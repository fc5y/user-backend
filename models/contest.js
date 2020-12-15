"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Contest extends Model {}
  Contest.init(
    {
      contest_name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      start_time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      duration: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      contest_title: {
        allowNull: true,
        type: DataTypes.STRING,
      },
      can_enter: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      materials: {
        allowNull: false,
        type: DataTypes.JSON,
      },
    },
    {
      updatedAt: "updated_at",
      createdAt: "created_at",
      sequelize,
      modelName: "Contest",
    },
  );
  return Contest;
};
