const express = require("express");

const router = express.Router();

//@route Get api/auth
//@desc  test route
//acsess public
router.get("/", (req, res) => {
  res.json({ msg: "authentication works" });
});

module.exports = router;
