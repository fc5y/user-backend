"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Contest extends Model {}
  Contest.init(
    {
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      start_time: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      length_in_second: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      description: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      updatedAt: "updated_at",
      createdAt: "created_at",
      sequelize,
      modelName: "Contest",
    }
  );
  return Contest;
};
