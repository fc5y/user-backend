"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Participation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Participation.belongsTo(models.Contest, {
        foreignKey: "contest_id",
        as: "contest",
      });
      Participation.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  Participation.init(
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
      rank_in_contest: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      rating_change: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      is_hidden: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      contest_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      updatedAt: "updated_at",
      createdAt: "created_at",
      sequelize,
      modelName: "Participation",
    },
  );
  return Participation;
};
