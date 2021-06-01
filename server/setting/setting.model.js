const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema(
  {
    googlePayId: String,
    agoraId: String,
    agoraCertificate: { type: String, default: "AGORA CERTIFICATE" },
    hostCharge: { type: Number, default: 0 },
    policyLink: String,
    loginBonus: { type: Number, default: 0 },
    redeemGateway: { type: String, default: "Paypal" },
    minPoints: { type: Number, default: 200 },
    currency: { type: String, default: "USD" },
    howManyCoins: { type: Number, default: 2000 },
    toCurrency: { type: Number, default: 1 },
    streamingMinValue: { type: Number, default: 50 },
    streamingMaxValue: { type: Number, default: 200 },
    dailyTaskMinValue: { type: Number, default: 50 },
    dailyTaskMaxValue: { type: Number, default: 200 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Setting", settingSchema);
