const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
    from_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    to_user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Follower", followerSchema);
