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
	},
	subject: {
		type: Sequelize.STRING,
		field: "subject",
	},
	studentPassword: {
		type: Sequelize.STRING,
		field: "studentPassword"
	},
	teacherPassword: {
		type: Sequelize.STRING,
		field: "teacherPassword"
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
