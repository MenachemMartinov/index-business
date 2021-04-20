const jwt = require("jsonwebtoken");
const config = require("config");

/***
 * this a middleware to check if token is exist end if is invalid
 */
module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.jwt_KEY);
    req.user = decoded;
    next();
  } catch {
    res.status(400).send("Invalid token");
  }
};
  