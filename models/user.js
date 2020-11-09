const { DataTypes } = require('sequelize');

// We export a function that defines the model.
// This function will automatically receive as parameter the Sequelize connection object.
module.exports = (sequelize) => {
	sequelize.define('user', {
		// The following specification of the 'id' attribute could be omitted
		// since it is the default.
		id: {
			allowNull: false,
			autoIncrement: true,
			primaryKey: true,
			type: DataTypes.INTEGER
		},
		email: {
			allowNull: false,
			type: DataTypes.STRING,
			unique: true,
			validate: {
				isEmail: true
			}
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		school_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: { // hashed password have length of 64
			type: DataTypes.STRING(64),
			unique: true,
			allowNull: false,
			validate: {
				is: /^[0-9a-zA-Z]{64}$/i
			}
		},
		avatar_url: {
			type: DataTypes.STRING,
		},

	});
};
