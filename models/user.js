"use strict";
const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    // static associate(models) {
    //   // define association here
    // }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        validate: {
          // We require usernames to have length of at least 3, and
          // only use letters and whitespace.
          is: /^[A-Za-z\s]{3,50}/,
        },
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          // We require usernames to have length of at least 3, and
          // only use letters and whitespace.
          is: /^[A-Za-z\s]{3,50}/,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          // email validation
          is: /^([0-9a-zA-Z].*?@([0-9a-zA-Z].*\.\w{2,4}))$/gm,
        },
      },
      school_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      is_email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      verify_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verify_token_expired_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      updatedAt: "updated_at",
      createdAt: "created_at",
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
