const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");

//@route post api/post
//@desc  create a post
//acsess private
router.post(
  "/",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = User.findById(req.user.id).select("-password");

      const newPost = {
        text: req.body.text,
        name: req.user.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };

      const post = await newPost.save();
      res.json(post);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server Error");
    }
  }
);

//@route Get api/post
//@desc  Get all post
//acsess private

router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    // check if there is any post or not
    if (!posts) {
      res.status(404).json({ msg: "there is no post found" });
    }

    res.send(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//@route Get api/post/:id
//@desc   post by id
//acsess private
router.get("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    // check if there is any post or not
    if (!posts) {
      return res.status(404).json({ msg: "there is no post found" });
    }

    res.send(post);
  } catch (error) {
    console.error(error.message);
    // if no post found just check
    if (error.kind === ObjectId) {
      return res.status(404).json({ msg: "there is no post found" });
    }

    res.status(500).send("Server Error");
  }
});
//@route delete post/:id
//@desc  delete post
//acsess private

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    //check post
    if (!posts) {
      return res.status(404).json({ msg: "there is no post found" });
    }

    // check user
    if (this.post.user.toString() === req.user.id) {
      res.status(401).json({ msg: "user not authorized" });
    }

    await post.remove();
    res.json({ msg: "post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === ObjectId) {
      return res.status(404).json({ msg: "there is no post found" });
    }

    res.status(500).send("Server Error");
  }
});

module.exports = router;
