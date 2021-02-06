const express = require("express");
const { check, validationResult } = require("express-validator");
const user = require("../../models/User");
const gravatar = require("gravatar");

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

      res.json({ msg: "Users Works" });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("user exist");
    }
  }
);

module.exports = router;
