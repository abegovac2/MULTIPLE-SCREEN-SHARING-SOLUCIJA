const jwt = require("jsonwebtoken");
require("dotenv").config();

const tokenAuth = (() => {
  const auth = (req, res, next) => {
    if (!["/user/login", "/user/register"].includes(req.path)) {
      const token =
        req.body.token || req.query.token || req.headers["x-access-token"];

      if (!token) {
        return res
          .status(401)
          .send({ message: "A token is required for authentication" });
      }
      try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.user = decoded;
      } catch (err) {
        return res.status(401).send({ message: "Invalid Token" });
      }
    }
    return next();
  };

  const create = (data, expiration = "2h") => {
    return jwt.sign(data, process.env.TOKEN_KEY, {
      expiresIn: expiration,
    });
  };

  return { auth, create };
})();

module.exports = tokenAuth;