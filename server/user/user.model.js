const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: String,
    image: String,
    username: String,
    identity: String,
    bio: { type: String, default: null },
    coin: { type: Number, default: 0 },
    followers_count: { type: Number, default: 0 },
    following_count: { type: Number, default: 0 },
    fcm_token: String,
    block: { type: Boolean, default: false },
    country: String,
    dailyTaskDate: { type: String },
    dailyTaskFinishedCount: { type: Number, default: 0 },
    rate: { type: Number, default: 0 },
    isLogout: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
