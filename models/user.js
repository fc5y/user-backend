'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      autoIncrement: false,
    },
    full_name: {
		type: DataTypes.STRING,
		unique: true,
		validate: {
			// We require usernames to have length of at least 3, and
			// only use letters, numbers and underscores.
			is: /^\w{3,50}$/
		},
		allowNull: false,
	},
    email: {
		type: DataTypes.STRING,
		unique: true,
		validate: {
			// We require usernames to have length of at least 3, and
			// only use letters, numbers and underscores.
			is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
		},
		allowNull: false,
	},
    password: {
		type: DataTypes.STRING,
		unique: true,
		validate: {
			// We require usernames to have length of at least 3, and
			// only use letters, numbers and underscores.
			is: /^\w{3,50}$/
		},
		allowNull: false,
	},
    school_name: {
		type: DataTypes.STRING,
		unique: false,
		validate: {
			// We require usernames to have length of at least 3, and
			// only use letters, numbers and underscores.
			is: /^\w{3,50}$/
		},
		allowNull: true,
	}
  });
	return User;
};
