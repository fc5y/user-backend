"use strict";
const { Model } = require("sequelize");
const User = require("./user");
const Contest = require("./contest");

module.exports = (sequelize, DataTypes) => {
  class UserContestMapping extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  UserContestMapping.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      contest_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "UserContestMapping",
    }
  );
  UserContestMapping.associate = function (_models) {
    // associations can be defined here
    UserContestMapping.belongsTo(User, {
      foreignKey: {
        name: "user_id",
      },
    });
    UserContestMapping.belongsTo(Contest, {
      foreignKey: {
        name: "contest_id",
      },
    });
  };
  return UserContestMapping;
};
