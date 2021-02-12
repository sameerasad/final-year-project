const { json } = require("express");
const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth");
const User = require("../../models/User");

//@route Get api/auth
//@desc  test route
//acsess public
router.get("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); //exclude password
    res.json(user);
  } catch (err) {
    res.status(500).send("server error");
  }
});

module.exports = router;
