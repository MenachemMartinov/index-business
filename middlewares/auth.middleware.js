const jwt = require("jsonwebtoken");

/***
 * this a middleware to check if token is exist end if is invalid
 */
module.exports = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    log(error);
    res.status(400).send("Invalid token");
  }
};
