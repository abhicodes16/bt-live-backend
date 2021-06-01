const mongoose = require("mongoose");

const CountrySchema = new mongoose.Schema(
  {
    name: String,
    image: String,
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Country", CountrySchema);
