const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const User = sequelize.define("user", {
	id: {
		type: Sequelize.INTEGER,
		field: "id",
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	userName: {
		type: Sequelize.STRING,
		field: "userName",
		unique: true,
	},
	email: {
		type: Sequelize.STRING,
		field: "email",
		unique: true,
	},
	password: {
		type: Sequelize.STRING,
		field: "password",
	}
});

module.exports = User;
