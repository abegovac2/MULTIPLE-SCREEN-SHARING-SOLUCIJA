let chai = require("chai");
let chaiHttp = require("chai-http");

chai.use(chaiHttp);
const assert = chai.assert;

const server = require("../index.js");
const userController = require("../controllers/userController.js");

const Meet = require("../models/meet.js");
const User = require("../models/user.js");

async function resetTables() {
	await User.destroy({
		truncate: true,
	});
	await Meet.destroy({
		truncate: true,
	});
}

const numOfInitUsers = 10;
async function createMultipleUsers() {
	for (let i = 0; i < numOfInitUsers; ++i)
		await userController.register({
			body: {
				userName: `meho${i}`,
				email: `meho${i}@meho${i}.com`,
				password: `meho${i}meho${i}meho${i}`,
			}
		}, { status: (e) => { return { send: (obj) => { } } } });
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

let token = '';

const userControllerTest = () => {
	before(async () => {
		await resetTables();
		await createMultipleUsers();
	});

	beforeEach(function (done) {
		this.timeout(10000)
		done();
	});

	it("Access without token", function (done) {
		const routes = [...userRoutes, ...meetRoutes];
		for (let i = 2; i < routes.length; ++i)
			chai.request(server)[routes[i].method](routes[i].path)
				.set("content-type", "application/json")
				.send({ doesNotMatterNoToken: 123 })
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.status, 401);
					assert.equal(res.text, '{"message":"A token is required for authentication"}');
					if (i == routes.length - 1) done();
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
					assert.equal(res.text, '{"message":"Invalid Token"}');
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
					assert.equal(res.status, 400);
					assert.equal(res.text, '{"message":"Invalid input data for route"}');
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
				done();
			});
	});

	it("Duplicate registration", function (done) {
		let input = {
			userName: "Amar",
			email: "amar@amar.com",
			password: "amarAMAR2"
		};
		chai.request(server)
			.post("/user/register")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 409);
				assert.equal(res.text, `{"userName":"User with username: 'Amar' already exist!"}`);
				done();
			});
	});

	it("User login with userName", function (done) {
		let input = {
			userName: "Amar",
			password: "amarAMAR1"
		};
		chai.request(server)
			.post("/user/login")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				let obj = JSON.parse(res.text);
				assert.isTrue('token' in obj);
				token = obj.token;
				assert.equal(obj.user.userName, 'Amar');
				assert.equal(obj.user.email, 'amar@amar.com');
				done();
			});
	});

	it("User login with email", function (done) {
		let input = {
			email: "amar@amar.com",
			password: "amarAMAR1"
		};
		chai.request(server)
			.post("/user/login")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				let obj = JSON.parse(res.text);
				assert.isTrue('token' in obj);
				assert.equal(obj.user.userName, 'Amar');
				assert.equal(obj.user.email, 'amar@amar.com');
				done();
			});
	});

	it("Invalid login", function (done) {
		let input = {
			userName: "Amar",
			password: "amarAMAR2"
		};
		chai.request(server)
			.post("/user/login")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 409);
				assert.equal(res.text, `{"message":"Unsuccessful login"}`);
				done();
			});
	});

	it("Get all users", function (done) {
		let input = {
			token: token
		};
		chai.request(server)
			.get("/user/list")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				let { allUsers } = JSON.parse(res.text);
				assert.equal(allUsers.length, 11);
				assert.isTrue(allUsers.includes("Amar"));
				for (let i = 0; i < numOfInitUsers; ++i)
					assert.isTrue(allUsers.includes(`meho${i}`))
				done();
			});
	});

	it("Get user by userName", function (done) {
		let input = {
			token: token,
			userName: "Amar"
		};
		chai.request(server)
			.get("/user")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				let user = JSON.parse(res.text);
				assert.equal(user.userName, 'Amar');
				assert.equal(user.email, 'amar@amar.com');
				done();
			});
	});

	it("Get user by email", function (done) {
		let input = {
			token: token,
			email: "amar@amar.com"
		};
		chai.request(server)
			.get("/user")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				let user = JSON.parse(res.text);
				assert.equal(user.userName, 'Amar');
				assert.equal(user.email, 'amar@amar.com');
				done();
			});
	});

	it("Delete user by userName", function (done) {
		let input = {
			token: token,
			userName: "meho0",
			password: "meho0meho0meho0"
		};
		chai.request(server)
			.delete("/user")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				assert.equal(res.text, `{"message":"Successfuly deleted user meho0"}`);

				done();
			});
	});

	it("Delete user by email", function (done) {
		let input = {
			token: token,
			email: "meho1@meho1.com",
			password: "meho1meho1meho1"
		};
		chai.request(server)
			.delete("/user")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 200);
				assert.equal(res.text, `{"message":"Successfuly deleted user meho1"}`);
				done();
			});
	});

	it("Invalid delete user", function (done) {
		let input = {
			token: token,
			userName: "Amar",
			password: "netacna sifra"
		};
		chai.request(server)
			.delete("/user")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.status, 409);
				assert.equal(res.text, `{"message":"Unable to delete user Amar"}`);
				done();
			});
	});

}

describe("Route tests", function () {
	describe("User test", userControllerTest);
});
