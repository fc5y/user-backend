"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class Contest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Contest.hasMany(models.Participation, {
        foreignKey: 'contest_id',
        sourceKey: 'id',
      });
    }
  }
  Contest.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
