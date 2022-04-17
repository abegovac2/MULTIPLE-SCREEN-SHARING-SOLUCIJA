const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Meet = sequelize.define("meet", {
	id: {
		type: Sequelize.INTEGER,
		field: "id",
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	meetName: {
		type: Sequelize.STRING,
		field: "meetName",
		unique: true,
	},
	subject: {
		type: Sequelize.STRING,
		field: "subject",
	},
	studentPassword: {
		type: Sequelize.STRING,
		field: "password"
	},
	teacherPassword: {
		type: Sequelize.STRING,
		field: "password"
	},
	createdBy: {
		type: Sequelize.STRING,
		field: "createdBy",
	},
	startTime: {
		type: Sequelize.DATE,
		field: "startTime",
	},
	endTime: {
		type: Sequelize.DATE,
		field: "endTime"
	},
});

module.exports = Meet;
