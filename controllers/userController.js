const bcrypt = require("bcrypt");
const tokenAuth = require("../middleware/tokenAuth.js");
const { Op } = require("sequelize");

const User = require("../models/user.js");

const userController = (() => {
	const userPropCheck = (user, res) => {
		let result = !['userName', 'email', 'password'].every(el => el in user);
		if (result) res.status(400).send({ message: "Invalid input data for route" });
		return result;
	}

	const register = async (req, res) => {
		let user = req.body;

		if (userPropCheck(user, res)) return;

		try {
			const hashPassword = await bcrypt.hash(user.password, 10);
			user.password = hashPassword;
			try {
				await User.create(user);
				res.status(201).send(
					{
						userName: user.userName,
					}
				);
			} catch (e) {
				res.status(201).send(
					{
						userName: `User with username: '${user.userName}' already exist!`,
					}
				);
			}
		} catch {
			res.status(500).send({ message: "Internal server error" });
		}
	};

	const login = async (req, res) => {
		let inUser = req.body;

		if (userPropCheck(inUser, res)) return;

		try {
			let dbUser = await User.findOne({
				where: {
					userName: inUser.userName,
					[Op.or]: {
						email: inUser.email,
					},
				},
			});

			if (dbUser == null) {
				res.status(404).send({ message: "Querried user does not exist!" });
				return;
			}

			if (await bcrypt.compare(inUser.password, dbUser.password)) {
				inUser.id = dbUser.id;
				inUser.password = dbUser.password;
				let token = tokenAuth.create(inUser);
				res.status(200).send({ token: token, user: dbUser });
			} else {
				res.status(409).send({ message: "Unsuccessful login" });
			}
		} catch (e) {
			res.status(400).send({ message: "Invalid login data!" });
		}
	};

	const deleteUser = async (req, res) => {
		let inUser = req.body;
		inUser.userName = inUser.userName ?? "";
		inUser.email = inUser.email ?? "";

		if (userPropCheck(inUser, res)) return;

		try {
			let dbUser = await User.findOne({
				where: {
					userName: inUser.userName,
					[Op.or]: {
						email: inUser.email,
					},
				},
			});
			if (await bcrypt.compare(inUser.password, dbUser.password)) {
				await User.destroy({
					where: {
						userName: userName,
						[Op.or]: {
							email: email,
						},
					},
				});
				res
					.status(200)
					.send({ message: `Successfuly deleted user ${userName}` });
			}
		} catch (e) {
			res
				.status(409)
				.send({ message: `Unable to delete user ${userName}` });
		}
	};


	const getUser = async (req, res) => {
		let { userName } = req.body;
		try {
			let dbUser = await User.findOne({
				where: {
					userName: userName
				}
			});

			res.status(200).send(dbUser);
		} catch (e) {
			res.status(500).send({ message: "Internal server error" });
		}
	};

	const getAllUsers = async (req, res) => {
		try {
			let allUser = await User.findAll({
				attributes: ['userName']
			});
			res.status(200).send({ allUsers: allUser.map(el => el.userName) });
		} catch (e) {
			res.status(500).send({ message: "Internal server error" });
		}
	}

	return { register, login, deleteUser, getUser, getAllUsers };
})();

module.exports = userController;
