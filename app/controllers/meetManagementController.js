const Meet = require("../models/meet.js");
const routeWrappers = require("../utils/routeWrappers.js");
const bcrypt = require("bcrypt");
const fs = require("fs");

const createMeetController = (() => {

	const formatMeetObj = (meet) => {
		meet.passwordProtected = meetInfo.studentPassword || meetInfo.teacherPassword;
		delete meet.studentPassword;
		delete meet.teacherPassword;
		return meet
	}

	const createMeet = async (req, res) => {
		let meet = req.body;

		meet.startTime = Date.now();

		meet.studentPassword = await bcrypt.hash(meet.studentPassword ?? "", 10);
		meet.teacherPassword = await bcrypt.hash(meet.teacherPassword ?? "", 10);

		try {
			let newMeet = await Meet.create(meet);
			res.send(201).send(newMeet);
		} catch (e) {
			res.status(400).send({ message: "Meet already exists!" });
		}

	}

	const getAllMeets = async (req, res) => {

		let allMeets = await Meet.findAll({
			attributes: ['meetName', 'subject', 'createdBy']
		});
		res.status(200).send({ allMeets: allMeets });

	}

	const getMeetInfo = async (req, res) => {

		let { meetName } = req.body;
		let meetInfo = await Meet.findOne({ where: { meetName: meetName } });
		meetInfo = formatMeetObj(meetInfo);
		res.status(200).send({ meetInfo: meetInfo });

	}

	const configurationCheck = async (file, passwordInput, passwordMeet, meet, res) => {
		let isValid = await bcrypt.compare(passwordInput, passwordMeet);
		if (isValid) {
			fs.readFile(`../setupData/${file}`, "utf8", (err, setup) => {
				if (err)
					throw err;//res.status(500).send({ message: "Internal server error" });
				else
					res.status(200).send({ meet: formatMeetObj(meet), setup: JSON.parse(setup) });

			});
		} else res.status(400).send({ message: "Invalid password" });
	}

	const enterMeet = async (req, res) => {
		const { meetName, studentPassword, teacherPassword } = req.body;

		let meet = await Meet.findOne({ where: { meetName: meetName } });

		if (!meet) {
			res.status(404).send({ message: `Meet named ${meetName} does not exist.` });
			return;
		}

		if (meet.endDate != null) {
			res.status(409).send({ message: `Meet named ${meetName} has finished at ${meet.endDate}.` });
			return;
		}

		if (studentPassword)
			configurationCheck('studentMeet', studentPassword, meet.studentPassword, meet, res);
		else if (teacherPassword)
			configurationCheck('teacherMeet', teacherPassword, meet.teacherPassword, meet, res);
		else throw "error";

	}

	const endMeet = async (req, res) => {
		const { meetName, teacherPassword } = req.body;
		let meet = await Meet.findOne({ where: { meetName: meetName } });

		if (!meet) {
			res.status(404).send({ message: `Meet named ${meetName} does not exist.` });
			return;
		}

		if (meet.endDate != null) {
			res.status(409).send({ message: `Meet named ${meetName} has finished at ${meet.endDate}.` });
			return;
		}

		if (!await bcrypt.compare(teacherPassword, meet.teacherPassword)) {
			res.status(400).send({ message: `Incorrect password for meet: ${meetName}` });
			return;
		}

		meet.endDate = Date.now();

		await Meet.update(meet, {
			where: {
				id: meet.id
			}
		});

	}

	return [
		createMeet,
		getAllMeets,
		getMeetInfo,
		enterMeet,
		endMeet
	].reduce((obj, curr) => ({ ...obj, [curr.name]: routeWrappers.serverErrorWrap(curr) }), {});
})();

module.exports = createMeetController;
