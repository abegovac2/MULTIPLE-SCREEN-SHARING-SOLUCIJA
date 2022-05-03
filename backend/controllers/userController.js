const bcrypt = require("bcrypt");
const tokenAuth = require("../middleware/tokenAuth.js");
const routeWrappers = require("../utils/routeWrappers.js");
const { Op } = require("sequelize");

const User = require("../models/user.js");

const userController = (() => {
	const userPropCheck = (user, res) => {
		let result = !["userName", "email", "password"].every((el) => el in user);
		if (result)
			res.status(400).send({ message: "Invalid input data for route" });
		return result;
	};

	const findUserInDB = async (user, res) => {
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

		if (!dbUser) {
			res.status(404).send({ message: `Querried user, ${user.userName}, does not exist!` });
			return null;
		} else
			return dbUser.dataValues;
	};

	const register = async (req, res) => {
		let user = req.body;
		if (userPropCheck(user, res)) return;
		const hashPassword = await bcrypt.hash(user.password, 10);
		user.password = hashPassword;
		try {
			await User.create(user);
			res.status(201).send({ userName: user.userName });
		} catch (e) {
			res
				.status(409)
				.send({
					userName: `User with username: '${user.userName}' already exist!`,
				});
		}
	};

	const login = async (req, res) => {
		let inUser = req.body;

		if (
			!(("userName" in inUser || "email" in inUser) && "password" in inUser)
		) {
			res.status(400).send({ message: "Invalid input data for route" });
			return;
		}
		let dbUser = await findUserInDB(inUser, res);
		if (!dbUser) return;

		if (await bcrypt.compare(inUser.password, dbUser.password)) {
			inUser.id = dbUser.id;
			inUser.password = dbUser.password;
			let token = tokenAuth.create(inUser);
			res.status(200).send({ token: token, user: dbUser });
		} else res.status(409).send({ message: "Unsuccessful login" });
	};

	const deleteUser = async (req, res) => {
		let inUser = req.body;
		inUser.userName = inUser.userName ?? "";
		inUser.email = inUser.email ?? "";

		if (userPropCheck(inUser, res)) return;

		let dbUser = await findUserInDB(inUser, res);
		if (!dbUser) return;
		if (await bcrypt.compare(inUser.password, dbUser.password)) {
			await User.destroy({
				where: {
					[Op.or]: [
						{ userName: dbUser.userName },
						{ email: dbUser.email },
					],
				},
			});
			res
				.status(200)
				.send({ message: `Successfuly deleted user ${dbUser.userName}` });
		} else
			res.status(409).send({ message: `Unable to delete user ${inUser.userName.length == 0 ? inUser.email : inUser.userName}` });

	};

	const getUser = async (req, res) => {
		let inUser = req.body;
		let isGood = false;
		["email", "userName"].forEach((el) => {
			if (!(el in inUser)) inUser[el] = "";
			else isGood = true;
		});
		if (!isGood) {
			res.status(400).send({ message: "Invalid input data for route" });
			return;
		}

		let dbUser = await findUserInDB(inUser, res);
		if (!dbUser) return;

		res.status(200).send(dbUser);
	};

	const getAllUsers = async (req, res) => {
		let allUser = await User.findAll({
			attributes: ["userName"],
		});
		res.status(200).send({ allUsers: allUser.map((el) => el.userName) });
	};

	return [register, login, deleteUser, getUser, getAllUsers].reduce(
		(obj, curr) => ({
			...obj,
			[curr.name]: routeWrappers.serverErrorWrap(curr),
		}),
		{}
	);
})();

module.exports = userController;
