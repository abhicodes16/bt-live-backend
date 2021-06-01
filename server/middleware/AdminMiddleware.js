const Admin = require("../admin/admin.model");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const Authorization = req.get("Authorization");

    if (!Authorization) {
      throw new Error();
    }

    const decodeToken = await jwt.verify(Authorization, "jsonWebToken");
    const admin = await Admin.findById(decodeToken._id);
    req.admin = admin;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ error: error.message || "Unauthorized" });
  }
};
