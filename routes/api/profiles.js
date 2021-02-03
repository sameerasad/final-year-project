const express = require("express");

const router = express.Router();

//@route Get api/profiles
//@desc  test route
//acsess public
router.get("/", (req, res) => {
  res.json({ msg: "Profiles works" });
});

module.exports = router;
