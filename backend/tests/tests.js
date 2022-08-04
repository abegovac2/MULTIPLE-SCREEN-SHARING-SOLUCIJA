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

const allRouteTests = () => {
	it("Access without token", function (done) {
		const routes = [...userRoutes, ...meetRoutes];
		for (let i = 2; i < routes.length; ++i)
			chai.request(server)[routes[i].method](routes[i].path)
				.set("content-type", "application/json")
				.send({ doesNotMatterNoToken: 123 })
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.text, '{"message":"A token is required for authentication"}');
					assert.equal(res.status, 401);
					if (i == routes.length - 1) done();
				});
	});

	it("Access with invalid token", function (done) {
		const routes = [...userRoutes, ...meetRoutes];
		for (let i = 2; i < routes.length; ++i)
			chai.request(server)[routes[i].method](routes[i].path)
				.set("content-type", "application/json")
				.send({ token: "isNotGud" })
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.text, '{"message":"Invalid Token"}');
					assert.equal(res.status, 401);
					if (i == routes.length - 1) done();
				});
	});

	it("Invalid data for user routes", function (done) {
		let input = {
			token: token
		};
		const routes = [...userRoutes, ...meetRoutes];
		const noDataForRoutes = [2, 8];
		for (let i = 0; i < routes.length; ++i)
			if (!noDataForRoutes.includes(i))
				chai.request(server)[routes[i].method](routes[i].path)
					.set("content-type", "application/json")
					.send(input)
					.end((err, res) => {
						assert.isNull(err);
						assert.equal(res.text, `{"message":"Invalid input data for route"}`);
						assert.equal(res.status, 400);
						if (i == routes.length - 1) done();
					});

	});
}

const userControllerTest = () => {
	before(async () => {
		await resetTables();
		await createMultipleUsers();
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
					assert.equal(res.text, '{"message":"Invalid input data for route"}');
					assert.equal(res.status, 400);
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
				let obj = JSON.parse(res.text);
				assert.equal(obj.userName, input.userName);
				assert.equal(res.status, 201);
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
				assert.equal(res.text, `{"userName":"User with username: 'Amar' already exist!"}`);
				assert.equal(res.status, 409);
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
				let obj = JSON.parse(res.text);
				assert.isTrue('token' in obj);
				token = obj.token;
				assert.equal(obj.user.userName, 'Amar');
				assert.equal(obj.user.email, 'amar@amar.com');
				assert.equal(res.status, 200);
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
				let obj = JSON.parse(res.text);
				assert.isTrue('token' in obj);
				assert.equal(obj.user.userName, 'Amar');
				assert.equal(obj.user.email, 'amar@amar.com');
				assert.equal(res.status, 200);
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
				let { allUsers } = JSON.parse(res.text);
				assert.equal(allUsers.length, 11);
				assert.isTrue(allUsers.includes("Amar"));
				for (let i = 0; i < numOfInitUsers; ++i)
					assert.isTrue(allUsers.includes(`meho${i}`))
				assert.equal(res.status, 200);
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
				let user = JSON.parse(res.text);
				assert.equal(user.userName, 'Amar');
				assert.equal(user.email, 'amar@amar.com');
				assert.equal(res.status, 200);
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
				let user = JSON.parse(res.text);
				assert.equal(user.userName, 'Amar');
				assert.equal(user.email, 'amar@amar.com');
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Get nonexisting user", function (done) {
		let input = {
			token: token,
			userName: "Fahrudin",
			password: "netacna sifra"
		};
		chai.request(server)
			.get("/user")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, `{"message":"Querried user, Fahrudin, does not exist!"}`);
				assert.equal(res.status, 404);
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
				assert.equal(res.text, `{"message":"Successfuly deleted user meho0"}`);
				assert.equal(res.status, 200);

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
				assert.equal(res.text, `{"message":"Successfuly deleted user meho1"}`);
				assert.equal(res.status, 200);
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
				assert.equal(res.text, `{"message":"Unable to delete user Amar"}`);
				assert.equal(res.status, 409);
				done();
			});
	});

}

const meetControllerTest = () => {
	it("Invalid create meet parameters", function (done) {
		let input = [{
			token: token,
		}, {
			token: token,
			meetName: 'Prva parcijala',
		}, {
			token: token,
			createdBy: 'Suljo'
		}, {
			token: token,
			subject: 'Razvoj programskih rijesenja',
		}, {
			token: token,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Suljo'
		}, {
			token: token,
			meetName: 'Prva parcijala',
			createdBy: 'Suljo'
		}, {
			token: token,
			meetName: 'Prva parcijala',
			subject: 'Razvoj programskih rijesenja',
		}];
		for (let i = 0; i < input.length; ++i)
			chai.request(server)
				.post("/meet")
				.set("content-type", "application/json")
				.send(input[i])
				.end((err, res) => {
					assert.isNull(err);
					assert.equal(res.text, `{"message":"Invalid input data for route"}`);
					assert.equal(res.status, 400);
					if (i == input.length - 1) done();
				});
	});

	it("Invalid meet create w only student password", function (done) {
		let input = {
			token: token,
			meetName: 'Prva parcijala',
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
			studentPassword: "Doesn't matter its invalid"
		};
		chai.request(server)
			.post("/meet")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, `{"message":"You can't make a meet with a student password and no teacher password."}`);
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Valid meet create all types", function (done) {
		let meetTypes = [
			{
				token: token,
				meetName: `Parcijala 1`,
				subject: 'Razvoj programskih rijesenja',
				createdBy: 'Amar'
			},
			{
				token: token,
				meetName: `Parcijala 2`,
				subject: 'Razvoj programskih rijesenja',
				createdBy: 'Amar',
				teacherPassword: 'password1'
			},
			{
				token: token,
				meetName: `Parcijala 3`,
				subject: 'Razvoj programskih rijesenja',
				createdBy: 'Amar',
				teacherPassword: 'password1',
				studentPassword: 'password2'
			},
		]
		for (let i = 0; i < 3; ++i)
			chai.request(server)
				.post("/meet")
				.set("content-type", "application/json")
				.send(meetTypes[i])
				.end((err, res) => {
					assert.isNull(err);
					let obj = JSON.parse(res.text);
					let input = meetTypes[i];
					assert.equal(obj.meetName, input.meetName);
					assert.equal(obj.subject, input.subject);
					assert.equal(obj.createdBy, input.createdBy);
					assert.equal(obj.passwordProtected, i != 0);
					assert.equal(res.status, 201);
					if (i == 2) done();
				});
	});

	it("Duplicate meet create", function (done) {
		let input = {
			token: token,
			meetName: 'Parcijala 1',
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
		};
		chai.request(server)
			.post("/meet")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, `{"message":"Meet already exists!"}`);
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Valid meet gets", function (done) {
		for (let i = 0; i < 3; ++i)
			chai.request(server)
				.get("/meet")
				.set("content-type", "application/json")
				.send({
					token: token,
					meetName: `Parcijala ${i + 1}`,
					subject: "Razvoj programskih rijesenja"
				})
				.end((err, res) => {
					assert.isNull(err);
					let obj = JSON.parse(res.text).meetInfo;
					let r = {
						meetName: `Parcijala ${i + 1}`,
						subject: 'Razvoj programskih rijesenja',
						createdBy: 'Amar',
						passwordProtected: i != 0
					};
					assert.equal(obj.meetName, r.meetName);
					assert.equal(obj.subject, r.subject);
					assert.equal(obj.createdBy, r.createdBy);
					assert.equal(obj.passwordProtected, r.passwordProtected)
					assert.equal(res.status, 200);
					if (i == 2) done();
				});
	});

	it("Invalid meet get", function (done) {
		let input = {
			token: token,
			meetName: 'Otorinolaringologija',
			subject: 'Biologija 1'
		};
		chai.request(server)
			.get("/meet")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, '{"message":"Meet named Otorinolaringologija does not exist."}')
				assert.equal(res.status, 404);
				done();
			});
	});

	it("Enter meet student", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			studentPassword: 'password2',
			createdBy: 'Amar'
		};
		chai.request(server)
			.get("/meet/enter")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				let { meet, setup } = JSON.parse(res.text);
				assert.equal(meet.meetName, input.meetName);
				assert.equal(meet.subject, input.subject);
				assert.equal(meet.createdBy, input.createdBy);
				assert.isTrue(meet.passwordProtected);
				assert.equal(JSON.stringify(setup), JSON.stringify(require("../controllers/setupData/studentMeet.js")));
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Enter meet teacher", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
			teacherPassword: 'password1'
		};
		chai.request(server)
			.get("/meet/enter")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				let { meet, setup } = JSON.parse(res.text);
				assert.equal(meet.meetName, input.meetName);
				assert.equal(meet.subject, input.subject);
				assert.equal(meet.createdBy, input.createdBy);
				assert.isTrue(meet.passwordProtected);
				assert.equal(JSON.stringify(setup), JSON.stringify(require("../controllers/setupData/teacherMeet.js")));
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Enter meet no password", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 1`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar'
		};
		chai.request(server)
			.get("/meet/enter")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				let { meet, setup } = JSON.parse(res.text);
				assert.equal(meet.meetName, input.meetName);
				assert.equal(meet.subject, input.subject);
				assert.equal(meet.createdBy, input.createdBy);
				assert.isFalse(meet.passwordProtected);
				assert.equal(JSON.stringify(setup), JSON.stringify(require("../controllers/setupData/teacherMeet.js")));
				assert.equal(res.status, 200);
				done();
			});
	});

	it("Enter meet no password (but required)", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar'
		};
		chai.request(server)
			.get("/meet/enter")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, `{"message":"Invalid access data for meet"}`);
				assert.equal(res.status, 400);
				done();
			});
	});

	it("Invalid password enter", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
			teacherPassword: 'incorrect',
		};
		chai.request(server)
			.get("/meet/enter")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, `{"message":"Invalid password"}`);
				assert.equal(res.status, 400);
				done();
			});
	});

	it("End meet invalid password", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
			teacherPassword: 'invalid',
		};
		chai.request(server)
			.put("/meet")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				assert.equal(res.text, '{"message":"Incorrect password for meet: Parcijala 3"}');
				assert.equal(res.status, 400);
				done();
			});
	});

	it("End meet invalid password", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
			teacherPassword: 'password1',
		};
		chai.request(server)
			.put("/meet")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				const regex = /{\"message\":\"Meet Parcijala 3 has finished at \d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}.\"}/g;
				let isCorrect = regex.test(res.text);
				assert.isTrue(isCorrect);
				assert.equal(res.status, 201);
				done();
			});
	});

	it("Enter finished meet", function (done) {
		let input = {
			token: token,
			meetName: `Parcijala 3`,
			subject: 'Razvoj programskih rijesenja',
			createdBy: 'Amar',
			teacherPassword: 'password1'
		};
		chai.request(server)
			.get("/meet/enter")
			.set("content-type", "application/json")
			.send(input)
			.end((err, res) => {
				assert.isNull(err);
				const regex = /{\"message\":\"Meet named Parcijala 3 has finished at \d{4}-\d{1,2}-\d{1,2} \d{1,2}:\d{1,2}:\d{1,2}.\"}/g;
				let isCorrect = regex.test(res.text);
				assert.isTrue(isCorrect);
				assert.equal(res.status, 409);
				done();
			});
	});

}

describe("Route tests", function () {
	describe("User test", userControllerTest);
	describe("Meet test", meetControllerTest);
	describe("Default route tests", allRouteTests);
});
