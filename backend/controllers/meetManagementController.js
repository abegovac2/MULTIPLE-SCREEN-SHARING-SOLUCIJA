const routeWrappers = require("../utils/routeWrappers.js");
const bcrypt = require("bcrypt");
const meetRepo = require("../repository/meetRepo.js");

const createMeetController = (() => {
	const formatMeetObj = (meet) => {
		meet.passwordProtected = !!(meet.studentPassword || meet.teacherPassword);
		delete meet.studentPassword;
		delete meet.teacherPassword;
		return meet;
	};

	const meetPropData = (data, obj, res) => {
		if (!data.every(el => el in obj)) {
			res.status(400).send({ message: "Invalid input data for route" });
			return false;
		}
		return true;
	}

	const createMeet = async (req, res) => {
		let meet = req.body;

		if (!meetPropData(['meetName', 'subject', 'createdBy'], meet, res)) return;

		meet.startTime = Date.now();

		meet.studentPassword = meet.studentPassword ? await bcrypt.hash(meet.studentPassword, 10) : null;
		meet.teacherPassword = meet.teacherPassword ? await bcrypt.hash(meet.teacherPassword, 10) : null;

		if (meet.studentPassword && !meet.teacherPassword) {
			res.status(400).send({ message: "You can't make a meet with a student password and no teacher password." });
			return;
		}
		delete meet.token;
		let newMeet = await meetRepo.findOrCreateNewMeet(meet);
		if (newMeet[1]) res.status(201).send(formatMeetObj(newMeet[0].dataValues));
		else res.status(400).send({ message: "Meet already exists!" });
	};

	const getAllMeets = async (req, res) => {
		let allMeets = await meetRepo.getAllMeetsByCollumns(["meetName", "subject", "createdBy"]);
		res.status(200).send({ allMeets: allMeets });
	};

	const getMeetInfo = async (req, res) => {
		const { meetName, subject } = req.body;

		if (!meetPropData(['meetName', 'subject'], req.body, res)) return;

		let meetInfo = await meetExitsAndFinishedCheck(meetName, subject, res, false);
		if (!meetInfo) return;
		meetInfo = formatMeetObj(meetInfo.dataValues);
		res.status(200).send({ meetInfo: meetInfo });
	};

	const configurationCheck = async (
		file,
		passwordInput,
		passwordMeet,
		meet,
		res,
		ignorePass = false
	) => {
		let isValid = await bcrypt.compare(passwordInput, passwordMeet);
		if (ignorePass || isValid) {
			let setup = require(`./setupData/${file}.js`);
			meet = formatMeetObj(meet.dataValues);
			res
				.status(200)
				.send({ meet: meet, setup: setup });
		} else res.status(400).send({ message: "Invalid password" });
	};

	const meetExitsAndFinishedCheck = async (meetName, subject, res, checkEndDate = true) => {
		let meet = await meetRepo.findOneMeet(meetName, subject);

		if (!meet) {
			res
				.status(404)
				.send({ message: `Meet named ${meetName} does not exist.` });
			return null;
		} else if (checkEndDate && !!meet.endTime) {
			res.status(409).send({
				message: `Meet named ${meetName} has finished at ${formatDateToString(meet.endTime)}.`,
			});
			return null;
		}

		return meet;
	}

	const enterMeet = async (req, res) => {
		const { meetName, subject, studentPassword, teacherPassword } = req.body;

		if (!meetPropData(['meetName'], req.body, res)) return;

		let meet = await meetExitsAndFinishedCheck(meetName, subject, res);
		if (!meet) return;

		if (meet.studentPassword && studentPassword)
			await configurationCheck(
				"studentMeet",
				studentPassword,
				meet.studentPassword,
				meet,
				res
			);
		else if (meet.teacherPassword && teacherPassword)
			await configurationCheck(
				"teacherMeet",
				teacherPassword,
				meet.teacherPassword,
				meet,
				res
			);
		else if ([
			meet.teacherPassword, studentPassword, meet.studentPassword, teacherPassword
		].every(el => !el))
			await configurationCheck(
				"teacherMeet",
				'',
				'',
				meet,
				res,
				true
			);
		else
			res
				.status(400)
				.send({ message: "Invalid access data for meet" });

	};

	const formatDateToString = (date) => {
		let end = new Date(date);
		return `${end.getFullYear()}-${end.getMonth()}-${end.getDate()} ${end.getHours()}:${end.getMinutes()}:${end.getSeconds()}`
	}
	const endMeet = async (req, res) => {
		const { meetName, subject, teacherPassword } = req.body;

		if (!meetPropData(['meetName', 'subject', 'teacherPassword'], req.body, res)) return;
		let meet = await meetExitsAndFinishedCheck(meetName, subject, res);
		if (!meet) return;

		if (!(await bcrypt.compare(teacherPassword, meet.teacherPassword))) {
			res
				.status(400)
				.send({ message: `Incorrect password for meet: ${meetName}` });
			return;
		}

		meet.endTime = Date.now();

		await meet.save();
		res.status(201).send({
			message: `Meet ${meet.meetName} has finished at ${formatDateToString(meet.endTime)}.`,
		});
	};

	return [createMeet, getAllMeets, getMeetInfo, enterMeet, endMeet].reduce(
		(obj, curr) => ({
			...obj,
			[curr.name]: routeWrappers.serverErrorWrap(curr),
		}),
		{}
	);
})();

module.exports = createMeetController;
