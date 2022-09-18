const Sequelize = require("sequelize");
require('dotenv').config()
/*
const { DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
	host: DB_HOST,
	dialect: "postgres",
	port: DB_PORT,
	logging: false,
});
*/
const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: 'postgres',
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false
		}
	}
});
module.exports = sequelize;
