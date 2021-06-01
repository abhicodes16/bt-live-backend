const mongoose = require("mongoose");

const redeemSchema = new mongoose.Schema(
  {
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentGateway: String,
    description: String,
    coin: Number,
    accepted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Redeem", redeemSchema);
