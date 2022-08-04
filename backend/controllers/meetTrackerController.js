
const attendanceRepo = require("../repository/attendanceRepo.js");

const meetTrackerController = (
	() => {


		const logUserEnterMeet = async (req, res) => {
			const {currUser, body} = req;
			await attendanceRepo.logUserToMeet(body.meetId, currUser.id, "ENTER");
			res.status(200).send();
		}

		const logUserExitMeet = async (req, res) => {
			const {currUser, body} = req;
			await attendanceRepo.logUserToMeet(body.meetId, currUser.id, "EXIT");
			res.status(200).send();
		}

		const getMeetAttendance = async (req, res) => {
			let attendance = await attendanceRepo.getMeetAttendance(req.meetId);
			res.status(200).send({
				attendance
			})
		} 

		const getUsersAttendance = async (req, res) => {
			const {userId, meetId} = req.body;
			let userAttendance = await attendanceRepo.getUsersAttendance(userId, meetId);
			res.status(200).send({
				userAttendance
			});
		}



		return {
			logUserEnterMeet,
			logUserExitMeet,
			getMeetAttendance,
			getUsersAttendance
		};
	}
)();

module.exports = meetTrackerController;