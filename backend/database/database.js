const Sequelize = require("sequelize");
require('dotenv').config()
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "mysql",
	port: DB_PORT,
	logging: false,
});

module.exports = sequelize;
