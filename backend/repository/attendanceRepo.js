
const Attendance = require("../models/attendance.js");
const User = require("../models/user.js");

const attendanceRepo = (
	() => {


		const logUserToMeet = async (meetId, userId, action) => await Attendance.create({
				meetId: meetId,
				userId: userId,
				action: action
			});

		

		const getMeetAttendance = async (meetId) => {
			let allAttendedUsers = await User.findAll({
				attributes: ["username"],
				include:[{
					model: Attendance,
					where: {
						userId: User.id,
						meetId: meetId
					}
				}]
			});
			return allAttendedUsers.map(el => el.dataValues);
		} 

		const getUsersAttendance = async (userId, meetId) => {
			let list = await Attendance.findAll({
					where: {userId,meetId},
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