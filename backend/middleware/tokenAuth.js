const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user.js");
const { Op } = require("sequelize");

const tokenAuth = (() => {
	const auth = async (req, res, next) => {
		if (!["/user/login", "/user/register"].includes(req.path)) {
			const token =
				req.body.token || req.query.token || req.headers["x-access-token"];

			if (!token) {
				return res
					.status(401)
					.send({ message: "A token is required for authentication" });
			}
			try {
				const decoded = jwt.verify(token, process.env.TOKEN_KEY);
				let dbUser = await User.findOne({
					where: {
						[Op.and]: [
							{ id: decoded.id },
							{ userName: decoded.userName },
							{ email: decoded.email },
							{ password: decoded.password },
						],
					},
				});
				if (!dbUser) throw "invalid";
				req.currUser = decoded;
			} catch (err) {
				return res.status(401).send({ message: "Invalid Token" });
			}
		}
		return next();
	};

	const create = (data, expiration = "2h") => {
		return jwt.sign(data, process.env.TOKEN_KEY, {
			expiresIn: expiration,
		});
	};

	return { auth, create };
})();

module.exports = tokenAuth;