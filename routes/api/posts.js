const express = require("express");

const router = express.Router();
//@route Get api/post
//@desc  test route
//acsess public
router.get("/", (req, res) => {
  res.json({ msg: "Posts works" });
});

module.exports = router;
