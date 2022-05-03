const express = require("express");
const meetManagementRouter = express.Router();

const meetManagementController = require("../controllers/meetManagementController.js");

meetManagementRouter.route("/")
	.get(meetManagementController.getMeetInfo)
	.post(meetManagementController.createMeet)
	.put(meetManagementController.endMeet);
meetManagementRouter.get("/list", meetManagementController.getAllMeets);
meetManagementRouter.get("/enter", meetManagementController.enterMeet);

module.exports = meetManagementRouter;