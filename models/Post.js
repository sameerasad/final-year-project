const mongoose = require("mongoose");

const Scheme = mongoose.Schema();
const postSchema = new Scheme({
  user: {
    type: Scheme.Types.ObjectID,
    ref: "users",
  },

  text: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  avatar: {
    type: String,
  },
  likes: [
    {
      user: {
        type: Scheme.Types.ObjectID,
        ref: "users",
      },
    },
  ],

  comments: [
    {
      user: {
        type: Scheme.Types.ObjectID,
        ref: "users",
      },

      text: {
        type: String,
        require: true,
      },
      name: {
        type: String,
      },
      avatar: {
        type: String,
      },

      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],

  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Post = mongoose.model("post", postSchema);
