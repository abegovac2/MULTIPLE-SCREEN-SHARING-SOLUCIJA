const Sequelize = require("sequelize");
const sequelize = require("../database/database");

const Attendance = sequelize.define("attendance", {
	id: {
		type: Sequelize.INTEGER,
		field: "id",
		autoIncrement: true,
		allowNull: false,
		primaryKey: true,
	},
	meetId: {
		type: Sequelize.INTEGER,
		field: "meetId",
	},
	userId: {
		type: Sequelize.INTEGER,
		field: "userId",
	},
	timestamp: {
		type: Sequelize.DATE,
		field: "timestamp"
	},
	action: {
		type: Sequelize.ENUM('ENTER', 'EXIT'),
		field: "ACTION"
	}
});

module.exports = Attendance;
