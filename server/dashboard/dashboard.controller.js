const User = require("../user/user.model");
const Country = require("../country/country.model");
const Category = require("../category/category.model");
const Gift = require("../gift/gift.model");
const Emoji = require("../emoji/emoji.model");
const Sticker = require("../sticker/sticker.model");
const Plan = require("../plan/plan.model");
const Image = require("../image/image.model");

exports.index = async (req, res) => {
  try {
    let total_count = {};

    total_count.user = await User.countDocuments();
    total_count.country = await Country.countDocuments();
    total_count.category = await Category.countDocuments();
    total_count.gift = await Gift.countDocuments();
    total_count.emoji = await Emoji.countDocuments();
    total_count.sticker = await Sticker.countDocuments();
    total_count.image = await Image.countDocuments();
    total_count.plan = await Plan.countDocuments();

    return res
      .status(200)
      .json({ status: true, message: "success", data: total_count });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, error: error.message || "server error" });
  }
};
