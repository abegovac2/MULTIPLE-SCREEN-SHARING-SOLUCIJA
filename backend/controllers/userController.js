const bcrypt = require("bcryptjs");
const tokenAuth = require("../middleware/tokenAuth.js");
const routeWrappers = require("../utils/routeWrappers.js");
const userRepo = require("../repository/userRepo.js");

const userController = (() => {
	const userPropCheck = (user, res) => {
		let result = !["userName", "email", "password"].every((el) => el in user);
		if (result)
			res.status(400).send({ message: "Invalid input data for route" });
		return result;
	};

	const register = async (req, res) => {
		let user = req.body;
		if (userPropCheck(user, res)) return;
		const hashPassword = await bcrypt.hash(user.password, 10);
		user.password = hashPassword;
		try {
			let dbUser = await userRepo.createUser(user);
			dbUser = dbUser.dataValues;
			const token = tokenAuth.create(dbUser);
			res.cookie("token", {
				token
			},
				{
					maxAge: 60000 * 50,
				}
			).status(201).send({ token: token, user: dbUser });
		} catch (e) {
			console.log("error", e)
			res
				.status(409)
				.send({
					userName: `User with username: '${user.userName}' already exist!`,
				});
		}
	};

	const login = async (req, res) => {
		let inUser = req.body;
		console.log("asdfasfadsfasf", inUser);

		if (
			!(("userName" in inUser || "email" in inUser) && "password" in inUser)
		) {
			res.status(400).send({ message: "Invalid input data for route" });
			return;
		}
		let dbUser = await userRepo.findUser(inUser);
		if (!dbUser) {
			res.status(404).send({ message: `Querried user, ${inUser.userName}, does not exist!` });
			return;
		}

		if (await bcrypt.compare(inUser.password, dbUser.password)) {
			let token = tokenAuth.create(dbUser);
			delete dbUser.password;
			res.cookie("token", {
				token
			},
				{
					maxAge: 60000 * 50,
				}
			).status(200).send({ token: token, user: dbUser });
		} else res.status(409).send({ message: "Unsuccessful login" });
	};

	const deleteUser = async (req, res) => {
		let inUser = req.body;
		inUser.userName = inUser.userName ?? "";
		inUser.email = inUser.email ?? "";

		if (userPropCheck(inUser, res)) return;

		let dbUser = await userRepo.findUser(inUser);
		if (!dbUser) {
			res.status(404).send({ message: `Querried user, ${inUser.userName}, does not exist!` });
			return;
		}

		if (await bcrypt.compare(inUser.password, dbUser.password)) {
			await userRepo.deleteUser(dbUser);
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

		let dbUser = await userRepo.findUser(inUser);
		if (!dbUser)
			return res.status(404).send({ message: `Querried user, ${inUser.userName}, does not exist!` });


		res.status(200).send(dbUser);
	};

	const getAllUsers = async (req, res) => {
		let allUser = await userRepo.getAllUsersByCollumns(["username"]);
		res.status(200).send({ allUsers: allUser.map((el) => el.username) });
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
