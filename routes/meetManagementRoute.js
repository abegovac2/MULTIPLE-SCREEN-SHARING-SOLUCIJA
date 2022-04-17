const express = require("express");
const meetManagementRouter = express.Router();

const meetManagementController = require("../controllers/meetManagementController.js");

meetManagementRouter.route("/")
    .post(meetManagementController.createMeet)
    .get(meetManagementController.getMeetInfo);
meetManagementRouter.get("/meet-list", meetManagementController.getAllMeets);

module.exports = meetManagementRouter;