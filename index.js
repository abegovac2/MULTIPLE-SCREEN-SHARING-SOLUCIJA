const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const sequelize = require("./database/database.js");
const tokenAuth = require("./middleware/tokenAuth.js")

const userRoute = require("./routes/userRoute.js");
const meetManagement = require("./routes/meetManagementRoute.js");

app.use(bodyParser.json());
app.use(tokenAuth.auth);

require('dotenv').config()

app.use("/user", userRoute);
app.use("/meets", meetManagement);


sequelize
	.sync({ forice: true })
	.then(() => app.listen(process.env.PORT))
	.catch((err) => {
		console.log(err);
	});

module.exports = app;