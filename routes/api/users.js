const express = require("express");
const { check, validationResult } = require("express-validator/check");

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
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.json({ msg: "Users Works" });
  }
);

module.exports = router;
