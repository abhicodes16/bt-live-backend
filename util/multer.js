const multer = require("multer");

module.exports = multer.diskStorage({
  filename: (req, file, callback) => {
    const filename =
      Date.now() + Math.floor(Math.random() * 100) + file.originalname;
    callback(null, filename);
  },
  destination: (req, file, callback) => {
    callback(null, "storage");
  },
});
