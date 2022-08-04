const { Op } = require("sequelize");
const Meet = require("../models/meet.js");

const meetRepo = (
	() => {

		const findOrCreateNewMeet = async (meet) => await Meet.findOrCreate({
				where: {
					[Op.and]: [
						{ meetName: meet.meetName },
						{ subject: meet.subject }
					]
				},
				defaults: meet,
			});

		const getAllMeetsByCollumns = async (columns) => await Meet.findAll({
			attributes: columns,
		});

		const findOneMeet = async (meetName, subject) => await Meet.findOne({
			where: {
				[Op.and]: [
					{ meetName: meetName },
					{ subject: subject }]
			}
		})

		return {
			findOrCreateNewMeet,
			getAllMeetsByCollumns,
			findOneMeet,

		};
	}
)();

module.exports = meetRepo;