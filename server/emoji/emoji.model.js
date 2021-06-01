const mongoose = require("mongoose");

const emojiSchema = new mongoose.Schema(
  {
    emoji: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Emoji", emojiSchema);
