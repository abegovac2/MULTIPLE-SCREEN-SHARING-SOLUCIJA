
const Attendance = require("../models/attendance.js");
const User = require("../models/user.js");
const { QueryTypes } = require('sequelize');
const sequelize = require("../database/database.js");

const attendanceRepo = (
	() => {


		const logUserToMeet = async (meetId, userId, action) => await Attendance.create({
			meetId: meetId,
			userId: userId,
			action: action
		});



		const getMeetAttendance = async (meetId) => {
			let allAttendedUsers = await sequelize.query(`
			SELECT Max(u.id) AS id, u."userName" AS "userName"
			FROM users u JOIN attendances a ON u.id = a."userId"
			WHERE a."meetId" = ${meetId}
			GROUP BY u.id;`,
				{ type: QueryTypes.SELECT });
			return allAttendedUsers;
		}

		const getUsersAttendance = async (userId, meetId) => {
			let list = await Attendance.findAll({
				where: { userId, meetId },
				order: ['createdAt']
			});
			return list.map(el => el.dataValues);
		}


		return {
			logUserToMeet,
			getMeetAttendance,
			getUsersAttendance
		};
	}
)();

module.exports = attendanceRepo;