const express = require("express");

const router = express.Router();

//@route Get api/user
//@desc  test route
//acsess public

router.get("/", (req, res) => {
  res.json({ msg: "Users Works" });
});

module.exports = router;
