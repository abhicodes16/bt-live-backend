const mongoose = require("mongoose");

const stickerSchema = new mongoose.Schema(
  {
    sticker: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sticker", stickerSchema);
