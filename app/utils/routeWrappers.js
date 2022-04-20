const routeWrappers = (
	() => {
		const serverErrorWrap = (foo) => {
			return async (req, res) => {
				try {
					await foo(req, res);
				} catch (e) {
					console.log(`SERVER ERROR ${e}`);
					res.status(500).send({ message: "Internal server error" });
				}
			}
		}

		return { serverErrorWrap }
	}
)();

module.exports = routeWrappers;