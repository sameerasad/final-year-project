const express = require("express");
const { check, validationResult } = require("express-validator");
const user = require("../../models/User");
const gravatar = require("gravatar");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

//@route post api/user
//@desc  register user route
//access public

router.post(
  "/",
  [
    check("name", "name is required").not().isEmpty(),
    check("email", "enter a valid email").isEmail(),
    check("password", "password should be atleast 6 character").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    //see if the user exists
    try {
      let user = await User.findOne({ email });
      if (email) {
        res.status(400).json({ errors: [{ msg: "user already exist" }] });
      }

      const avatar = gravatar.url(email, {
        s: "200",
        r: "pg",
        d: "mm",
      });
      //create instance of user in db
      user = new User({
        name,
        email,
        avatar,
        password,
      });
      //password is not hashed yet
      //use bcrypt to hashed the password

      const salt = await bcrypt.genSalt(10); // bcrypt return a promise
      user.password = await bcrypt.hash(password, salt);

      await user.save();
      res.json({ msg: "Users Works" });
      res.send("User Registered");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("user exist");
    }
  }
);

module.exports = router;
