const express = require("express");
const meetManagementRouter = express.Router();

const meetManagementController = require("../controllers/meetManagementController.js");
const meetTrackerController = require("../controllers/meetTrackerController.js");

meetManagementRouter.route("/")
	.get(meetManagementController.getMeetInfo)
	.post(meetManagementController.createMeet)
	.put(meetManagementController.endMeet);
meetManagementRouter.get("/list", meetManagementController.getAllMeets);
meetManagementRouter.get("/enter", meetManagementController.enterMeet);

meetManagementRouter
	.get("/attendance", meetTrackerController.getMeetAttendance)
	.post("/attendance/enter", meetTrackerController.logUserEnterMeet)
	.post("/attendance/exit", meetTrackerController.logUserExitMeet)
	.get("/user-attendance", meetTrackerController.getUsersAttendance);

module.exports = meetManagementRouter;