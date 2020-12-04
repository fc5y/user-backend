"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class EmailVerification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
  }
  EmailVerification.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /\d{6}/, // 6 digits
        },
      },
      expired_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EmailVerification",
      timestamps: false,
    }
  );
  return EmailVerification;
};
