const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors")

const app = express();

const sequelize = require("./database/database.js");
const tokenAuth = require("./middleware/tokenAuth.js")

const userRoute = require("./routes/userRoute.js");
const meetManagement = require("./routes/meetManagementRoute.js");

app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());

app.use(tokenAuth.auth);
app.use("/user", userRoute);
app.use("/meet", meetManagement);

sequelize
	.sync({ forice: false })
	.then(() => app.listen(process.env.NODE_DOCKER_PORT))
	.catch((err) => {
		console.log(err);
	});

module.exports = app;