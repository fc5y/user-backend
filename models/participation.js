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
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
  Participation.associate = function (_models) {
    Participation.belongsTo(User, {
      foreignKey: {
        name: "user_id",
      },
    });
    Participation.belongsTo(Contest, {
      foreignKey: {
        name: "contest_id",
      },
    });
  };
  return Participation;
};
