const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema(
  {
    country: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
    },
    type: {
      type: String,
      default: "fake",
    },
    coin: {
      type: Number,
    },
    rate: {
      type: Number,
    },
    name: {
      type: String,
    },
    image: {
      type: String,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    token: {
      type: String,
    },
    channel: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Image", imageSchema);
