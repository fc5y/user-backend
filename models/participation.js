'use strict';
const { Model, DataTypes } = require("sequelize");
const User = require("./user");
const Contest = require("./contest");

module.exports = (sequelize) => {
  class Participation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Participation.init({
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
      allowNull: false,
      defaultValue: 0,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    rating_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    is_hidden: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    updatedAt: "updated_at",
    createdAt: "created_at",
    sequelize,
    modelName: 'Participation',
  });
  // Participation.associate = function (models) {
    // Participation.belongsTo(models.User, {
    //   foreignKey: "user_id",
    //   as: "User",
    // });
    // Participation.belongsTo(models.Contest, {
    //   foreignKey: "contest_id",
    //   as: "Contest",
    // });
  // };
  return Participation;
};
