const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  // get token from header

  const token = req.header("x-auth-token");
  // check if not token

  if (!token) {
    res.status(401).json({ msg: "no tokken, Authorization denied." });
  }
  // verify the tokken

  try {
    const decoded = jwt.verify(token, config.get("jwtSecret")); // it takes 2 things token itself  and secret
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "invalid token" });
  }
};
