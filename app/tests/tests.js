let chai = require("chai");
let chaiHttp = require("chai-http");

const server = require("../index.js");

chai.use(chaiHttp);
const assert = chai.assert;

const Meet = require("../models/meet.js");
const User = require("../models/user.js");

function resetTables(done) {
	User.destroy({
		truncate: true,
	});
	Meet.destroy({
		truncate: true,
	});
	done();
}

const userRoutes = [
	{ method: "post", path: "/user/register" },
	{ method: "post", path: "/user/login" },
	{ method: "get", path: "/user/list" },
	{ method: "get", path: "/user" },
	{ method: "delete", path: "/user" },
]

const meetRoutes = [
	{ method: "post", path: "/meet" },
	{ method: "get", path: "/meet" },
	{ method: "put", path: "/meet" },
	{ method: "get", path: "/meet/list" },
	{ method: "get", path: "/meet/enter" },
]


const tokenTests = () => {
	before(resetTables);

	it("Access without token", function (done) {
		const routes = [...userRoutes, ...meetRoutes];
		for (let i = 2; i < routes.length; ++i)
			chai.request(server)[routes[i].method](routes[i].path)
				.set("content-type", "application/json")
				.send({ doesNotMatterNoToken: 123 })
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.status, 200);
					assert.equal(res.text, '{message:"A token is required for authentication"}');
					done();
				})
	});

	it("Access with invalid token", function (done) {
		const routes = [...userRoutes, ...meetRoutes];
		for (let i = 2; i < routes.length; ++i)
			chai.request(server)[routes[i].method](routes[i].path)
				.set("content-type", "application/json")
				.send({ token: "isNotGud" })
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.status, 401);
					assert.equal(res.text, '{message:"Invalid Token"}');
					if (i == routes.length - 1) done();
				})
	});

	it("Register invalid props", function (done) {
		const data = [
			{ userName: "Amar" },
			{ email: "amar@amar.com" },
			{ password: "amarAMAR1" },
			{
				email: "amar@amar.com",
				password: "amarAMAR1"
			},
			{
				userName: "Amar",
				password: "amarAMAR1"
			},
			{
				userName: "Amar",
				email: "amar@amar.com",
			}
		]
		for (let i = 0; i < data.length; ++i)
			chai.request(server)
				.post("/user/register")
				.set("content-type", "application/json")
				.send(data[i])
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.status, 401);
					assert.equal(res.text, '{message:"Invalid input data for route"}');
					if (i == data.length - 1) done();
				});
	});

	it("Valid registration", function (done) {
		let input = {
			userName: "Amar",
			email: "amar@amar.com",
			password: "amarAMAR1"
		};
		chai.request(server)
			.post("/user/register")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 201);
				let obj = JSON.parse(res.text);
				assert.equal(obj.userName, input.userName);
				assert.equal(obj.email, input.email);
				done();
			});
	});

	it("Duplicate registration", function (done) {
		let input = {
			userName: "Amar",
			email: "amar@amar.com",
			password: "amarAMAR1"
		};
		chai.request(server)
			.post("/user/register")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 409);
				assert.equal(obj.token, `{userName:"User with username: 'Amar' already exist!"}`);
				done();
			});
	});


}
