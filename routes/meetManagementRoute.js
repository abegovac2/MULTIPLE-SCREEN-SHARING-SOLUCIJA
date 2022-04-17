const express = require("express");
const meetManagementRouter = express.Router();

const meetManagementController = require("../controllers/meetManagementController.js");

meetManagementRouter.route("/")
	.post(meetManagementController.createMeet)
	.get(meetManagementController.getMeetInfo)
	.put(meetManagementController.endMeet);
meetManagementRouter.get("/list", meetManagementController.getAllMeets);
meetManagementRouter.get("/enter", meetManagementController.enterMeet);

module.exports = meetManagementRouter;