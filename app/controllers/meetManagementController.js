const Meet = require("../models/meet.js");
const routeWrappers = require("../utils/routeWrappers.js");
const bcrypt = require("bcrypt");
const fs = require("fs");

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
			res.send(400).send({ message: "You can't make a meet with a student password and no teacher password." });
			return;
		}
		delete meet.token;
		let newMeet = await Meet.findOrCreate({
			where: {
				meetName: meet.meetName,
			},
			defaults: meet,
		});
		if (newMeet[1]) res.status(201).send(newMeet[0].dataValues);
		else res.status(400).send({ message: "Meet already exists!" });
	};

	const getAllMeets = async (req, res) => {
		let allMeets = await Meet.findAll({
			attributes: ["meetName", "subject", "createdBy"],
		});
		res.status(200).send({ allMeets: allMeets });
	};

	const getMeetInfo = async (req, res) => {
		let { meetName } = req.body;

		if (!meetPropData(['meetName'], req.body, res)) return;

		//let meetInfo = await Meet.findOne({ where: { meetName: meetName } });
		let meetInfo = await meetExitsAndFinishedCheck(meetName, res, false);
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
		let isValid = ignorePass || await bcrypt.compare(passwordInput, passwordMeet);
		if (isValid) {
			fs.readFile(`../setupData/${file}`, "utf8", (err, setup) => {
				if (err)
					throw "Failed to read setup data";
				else
					res
						.status(200)
						.send({ meet: formatMeetObj(meet), setup: JSON.parse(setup) });
			});
		} else res.status(400).send({ message: "Invalid password" });
	};

	const meetExitsAndFinishedCheck = async (meetName, res, checkEndDate = true) => {
		let meet = await Meet.findOne({ where: { meetName: meetName } });

		if (!meet) {
			res
				.status(404)
				.send({ message: `Meet named ${meetName} does not exist.` });
			return null;
		} else if (checkEndDate && !meet.endDate) {
			res.status(409).send({
				message: `Meet named ${meetName} has finished at ${meet.endDate}.`,
			});
			return null;
		}

		return meet;
	}

	const enterMeet = async (req, res) => {
		const { meetName, studentPassword, teacherPassword } = req.body;

		if (!meetPropData(['meetName'], req.body, res)) return;

		let meet = meetExitsAndFinishedCheck(meetName, res);
		if (!meet) return;

		if (meet.studentPassword && studentPassword)
			configurationCheck(
				"studentMeet",
				studentPassword,
				meet.studentPassword,
				meet,
				res
			);
		else if (meet.teacherPassword && teacherPassword)
			configurationCheck(
				"teacherMeet",
				teacherPassword,
				meet.teacherPassword,
				meet,
				res
			);
		else if ([
			meet.teacherPassword, studentPassword, meet.studentPassword, teacherPassword
		].every(el => !el))
			configurationCheck(
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

	const endMeet = async (req, res) => {
		const { meetName, teacherPassword } = req.body;

		if (!meetPropData(['meetName', 'teacherPassword'], req.body, res)) return;
		let meet = meetExitsAndFinishedCheck(meetName, res);
		if (!meet) return;

		if (!(await bcrypt.compare(teacherPassword, meet.teacherPassword))) {
			res
				.status(400)
				.send({ message: `Incorrect password for meet: ${meetName}` });
			return;
		}

		meet.endDate = Date.now();

		await Meet.update(meet, {
			where: {
				id: meet.id,
			},
		});

		res.status(201).send({
			message: `Meet ${meet.meetName} has finished at ${meet.endDate}.`,
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
