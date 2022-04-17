const express = require("express");
const userRouter = express.Router();

const userController = require("../controllers/userController.js");

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);
userRouter.get("/list", userController.getAllUsers);
userRouter.route("/")
	.get(userController.getUser)
	.delete(userController.deleteUser);



module.exports = userRouter;
