const Meet = require("../models/meet.js");
const bcrypt = require("bcrypt");
const fs = require("fs");

const createMeetController = (() => {

  const formatMeetObj = (meet) => {
    meet.passwordProtected = meetInfo.studentPassword || meetInfo.teacherPassword;
    delete meet.studentPassword;
    delete meet.teacherPassword;
    return meet
  }

  const createMeet = async (req, res) => {
    let meet = req.body;

    meet.startTime = Date.now();

    try {

      meet.studentPassword = await bcrypt.hash(meet.studentPassword ?? "", 10);
      meet.teacherPassword = await bcrypt.hash(meet.teacherPassword ?? "", 10);

      try {
        let newMeet = await Meet.create(meet);
        res.send(201).send(newMeet);
      } catch (e) {
        res.status(400).send({ message: "Meet already exists!" });
      }
    } catch (e) {
      res.status(500).send({ message: "Internal server error" });

    }
  }

  const getAllMeets = async (req, res) => {
    try {
      let allMeets = await Meet.findAll({
        attributes: ['meetName', 'subject', 'createdBy']
      });
      res.status(200).send({ allMeets: allMeets });
    } catch (e) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  const getMeetInfo = async (req, res) => {
    try {
      let { meetName } = req.body;
      let meetInfo = await Meet.findOne({ where: { meetName: meetName } });
      meetInfo = formatMeetObj(meetInfo);
      res.status(200).send({ meetInfo: meetInfo });
    } catch (e) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  const configurationChek = (file, passwordInput, passwordMeet, meet, res) => {
    if (await bcrypt.compare(passwordInput, passwordMeet)) {
      fs.readFile(`../setupData/${file}`, "utf8", (err, setup) => {
        if (err)
          res.status(500).send({ message: "Internal server error" });
        else
          res.status(200).send({ meet: formatMeetObj(meet), setup: JSON.parse(setup) });

      });
    }else res.status(400).send({message: "Invalid password"});
  }

  const enterMeet = async (req, res) => {
    const { meetName, studentPassword, teacherPassword } = req.body;

    try {
      let meet = await Meet.findOne({ where: { meetName: meetName } });

      if (!meet) {
        res.status(404).send({ message: `Meet named ${meetName} does not exist.` });
        return;
      }

      if (meet.endDate <= Date.now()) {
        res.status(409).send({ message: `Meet named ${meetName} has finished at ${meet.endDate}.` });
        return;
      }

      if (studentPassword)
        configurationChek('studentMeet', studentPassword, meet.studentPassword, meet, res);
      else if (teacherPassword)
        configurationChek('teacherMeet', teacherPassword, meet.teacherPassword, meet, res);

    } catch (e) {
      res.status(500).send({ message: "Internal server error" });
    }
  }

  const endMeet = (req, res) => {
    const { meetName, teacherPassword } = req.body;

  }

  return {
    createMeet,
    getAllMeets,
    getMeetInfo,
    enterMeet,
    endMeet
  };
})();

module.exports = createMeetController;
