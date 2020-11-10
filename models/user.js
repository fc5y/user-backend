const { DataTypes } = require('sequelize');
const { Sequelize } = require('../sequelize');

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
			defaultValue: "abc@xyz.com",
			unique: true,
			validate: {
				isEmail: true
			}
		},
		full_name: {
			type: DataTypes.STRING,
			allowNull: false,
			defaultValue: "Nguyen Van A"
		},
		school_name: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: { // hashed password have length of 64
			type: DataTypes.STRING(64),
			unique: true,
			defaultValue: "MaLhr2g3uWUuUu57FQn2xGPJ6k24UaVnY6amEuk8BvchStnqkNe9o9W5s6CnXLox",
			allowNull: false,
			validate: {
				is: /^[0-9a-zA-Z]{64}$/i
			}
		},
		avatar_url: {
			type: DataTypes.STRING
		},
		is_email_verified: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	}),
	sequelize.define('rating_histories', {
		user_id: {
			allowNull: false,
			type: DataTypes.INTEGER,
			references: {
				model: 'users',
				key: 'id'
			}
		}
	});
};
