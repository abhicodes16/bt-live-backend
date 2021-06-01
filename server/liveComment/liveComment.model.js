const mongoose = require("mongoose");

const LiveCommentSchema = new mongoose.Schema(
  {
    name: String,
    comment: String,
    token: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("LiveComment", LiveCommentSchema);
