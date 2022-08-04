
const { Op } = require("sequelize");

const User = require("../models/user.js");

const userRepo = (
	() => {


		const findUser = async (user) => {
			user.userName = user.userName ?? '';
			user.email = user.email ?? '';
			let dbUser = await User.findOne({
				where: {
					[Op.or]: [
						{ userName: user.userName },
						{ email: user.email },
					],
				},
			});
			return !dbUser ? null : dbUser.dataValues;
		}

		const deleteUser = async (dbUser) => {
			return await User.destroy({
				where: {
					[Op.or]: [
						{ userName: dbUser.userName },
						{ email: dbUser.email },
					],
				},
			});
		}

		const createUser = async (user) => await User.create(user);

		const getAllUsersByCollumns = async (columns) => {
			let allUsers = await User.findAll({
				attributes: columns,
			});
			return allUsers.map(el => el.dataValues);
		}
		

		return {
			findUser,
			deleteUser,
			getAllUsersByCollumns,
			createUser
		};
	}
)();

module.exports = userRepo;