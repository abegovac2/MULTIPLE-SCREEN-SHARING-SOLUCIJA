const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require('path');
const cors = require("cors")
const https = require("https");
const fs = require("fs");

const app = express();

const sequelize = require("./database/database.js");
const tokenAuth = require("./middleware/tokenAuth.js")

const userRoute = require("./routes/userRoute.js");
const meetManagement = require("./routes/meetManagementRoute.js");

app.use(cors())
app.use(bodyParser.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "production") app.use(express.static(path.join(__dirname, '/build')));

app.use(tokenAuth.auth);
app.use("/api/user", userRoute);
app.use("/api/meet", meetManagement);
/*
sequelize
	.sync({ forice: false })
	.then(() => {
		https
			.createServer(
				{
					key: fs.readFileSync("key.pem"),
					cert: fs.readFileSync("cert.pem"),
				},
				app
			)
			.listen((process.env.PORT || 5000), () => {
				console.log(`server is runing at port ${(process.env.PORT || 5000)}`);
			});
	})
	.catch((err) => {
		console.log(err);
	});
*/

sequelize
	.sync({ forice: false })
	.then(() => app.listen(process.env.PORT || 5000, () => console.log(`server is runing at port ${(process.env.PORT || 5000)}`)))
	.catch(err => console.log(err));

module.exports = app;