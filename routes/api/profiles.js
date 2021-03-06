const express = require("express");
const mongoose = require("mongoose");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const router = express.Router();
const config = require("config");
const request = require("request");
// Load Profile Model
const Profile = require("../../models/Profile");
// Load User Model
const User = require("../../models/User");
const nodemon = require("nodemon");

//@route Get api/profiles/me
//@desc  get current user profile
//acsess private

router.get("/me", auth, async (req, res) => {
  try {
    const profile = await (
      await Profile.findOne({ user: req.user.id })
    ).populate("user", ["name", "avatar"]);

    if (!profile) {
      res.status(400).json({ msg: "there is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).send("server Error");
  }
});

//@route Post api/profile
//@desc  create or update user profile
//acsess private

router.post(
  "/",
  [
    auth,
    [
      check("status", "status is required").not().isEmpty(),
      check("skills", "skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      res.status(400).json({ error: error.array() });
    }
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin,
    } = req.body;

    //build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    // Skills - Spilt into array
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim);
    }
    console.log(profileFields.skills);
    res.send("hello");

    // create Social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      // here id come from token
      let profile = await profile.findOne({ user: req.user.id });
      //update profile

      if (profile) {
        const profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );
        res.json(profile);
      }

      if (!profile) {
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
      }
    } catch (error) {
      console.error(error.message);
    }
  }
);
//@route get api/profiles
//@desc  get all profiles
//acsess public

router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//@route get api/profiles/user/:user_id
//@desc  get profile by user id
//acsess public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (!profile)
      return res.status(400).json({ msg: "there is no profile for this user" });

    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//@route Delete api/profile,
//@desc  delete profile,user & posts
//acsess private

router.delete("/", auth, async (req, res) => {
  try {
    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    // remove user
    await User.findOneAndDelete({ _id: req.user.id });

    res.json({ msg: "user deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//@route put api/profile/experience
//@desc  add profile experience
//acsess private

router.put(
  "/experience",
  [
    auth,
    check("title", "title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      company,
      title,
      location,
      from,
      to,
      current,
      description,
    } = req.body;
    // newExp this will create an object of data that user submit
    const newExp = { company, title, location, from, to, current, description };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server Error");
    }
  }
);

//@route Delete api/profile/experience/:exp_id
//@desc  delete experience from profile
//acsess private

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = Profile.findOne({ user: user.req.id });
    //get remove index
    const removeIndex = profile.experience
      .map((item) => item)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//@route put api/profile/education
//@desc  add profile education
//acsess private

router.put(
  "/education",
  [
    auth,
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("fieldofstudy", "Field date is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      shool,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body;
    // newExp this will create an object of data that user submit
    const newEdu = {
      shool,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).json("Server Error");
    }
  }
);

//@route Delete api/profile/education/:edu_id
//@desc  delete education from profile
//acsess private

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = Profile.findOne({ user: user.req.id });
    //get remove index
    const removeIndex = profile.education
      .map((item) => item)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error);
    res.status(500).json("server error");
  }
});

//@route Get api/profile/github/:username
//@desc  get repos from github
//acsess public

router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githudClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "users-agent": "node.js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        res.status(404).json({ msg: "No Github Profile Found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
