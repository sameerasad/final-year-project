const express = require("express");

const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const { findById } = require("../../models/User");

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

      const newPost = new Post({
        text: req.body.text,
        name: req.user.name,
        avatar: req.body.avatar,
        user: req.user.id,
      });

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

//@route  Put api/posts/like/:id
//@desc  like a post
//acsess private

router.put("/like/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id).length >
      0
    ) {
      return res.status(400).json({ msg: "Post already liked" });
    }
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route  Put api/posts/unlike/:id
//@desc  like a post
//acsess private

router.put("/unlike/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (
      post.likes.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "Post has not yet been liked" });
    }
    // remove index

    const removeIndex = post.likes
      .map((like) => like.user.toString())
      .indexOf(req.user.id);

    post.like.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

//@route post api/comment/:id
//@desc  create a comment
//acsess private
router.post(
  "/comment/:id",
  [auth, [check("text", "text is required").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = User.findById(req.user.id).select("-password");
      const post = findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: req.user.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };

      post.comments.unshift(newComment);
      await post.save();

      res.json(post.comments);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("server Error");
    }
  }
);
//@route Delete api/comment/:id/comment_id
//@desc  Delete a comment
//acsess private

router.delete("/comment/:id/comment_id", auth, async (req, res) => {
  try {
    const post = findById(req.params.id);

    // pull out comment

    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );

    // make sure comment exist

    if (!comment) return res.status(404).json({ msg: "Bad Request" });

    // check user

    if (!comment.user.toString() === req.user.id) {
      return res.status(401).json({ msg: "unauthorized user" });
    }
    // get Remove Index
    const removeIndex = post.comments
      .map((comment) => comment.user.toString())
      .indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    //save post which include comment as well
    await post.save();

    // send respons
    res.json(post.comments);
  } catch (error) {
    console.error(error);
    res.status(400).send("Server Error");
  }
});

module.exports = router;
