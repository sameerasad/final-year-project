const express = require("express");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const router = express.Router();
// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");

//@route Get api/profiles/me
//@desc  test routes
//acsess private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populated("user", ["name", "avatar"]);

    if (!profile) {
      res.status(400).json({ msg: "there is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send("server Error");
  }
});

module.exports = router;
