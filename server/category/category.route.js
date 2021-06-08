const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = require("../../util/multer");

const CategoryController = require("./category.controller");
const Category = require("./category.model");
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoURI = require("../../util/mongodbURL");
const domain = require("../../util/domain");
const mongoose = require('mongoose');

const upload = multer({
  storage,
});

var filename;

// Storage
// const liveStorage = new GridFsStorage({ 
//   url: mongoURI,
//   file: (req, file) => {
//     return new Promise((resolve, reject) => {
//       crypto.randomBytes(16, (err, buf) => {
//         if (err) {
//           return reject(err);
//         }
//         filename = buf.toString('hex') + path.extname(file.originalname);
//         const fileInfo = {
//           filename: filename,
//           bucketName: 'images',
//         };
//         resolve(fileInfo);
//       });
//     });
//   },
// });

// const upload = multer({ storage: liveStorage });

// const url = mongoURI;
// const connect = mongoose.createConnection(url, {
//       useNewUrlParser:true,
//       useCreateIndex:true,
//       useFindAndModify:false,
//       useUnifiedTopology:true
// });
// let gfs;

// connect.once('open', () => {
//   gfs = new mongoose.mongo.GridFSBucket(connect.db, {
//     bucketName: "uploads"
//   });
// });

var checkAccessWithSecretKey = require("../../checkAccess");

router.use(checkAccessWithSecretKey());

router.get("/", CategoryController.index);

router.post("/", upload.single("icon"), CategoryController.store);

router.patch("/:category_id", upload.single("icon"), CategoryController.update);

router.put("/:category_id", CategoryController.isTopToggle);

router.delete("/:category_id", CategoryController.destroy);

router.delete("/delete/:category_id", CategoryController.destroyAll);

// router.post("/", upload.single("icon"), async(req, res, next) => {
//   try {
//     if (!req.body)
//       return res
//         .status(200)
//         .json({ status: false, message: "Invalid details." });
//     if (!req.body.name)
//       return res
//         .status(200)
//         .json({ status: false, message: "name is required" });

//     if (!req.file)
//       return res
//         .status(200)
//         .json({ status: false, message: "please select an image" });

//     const category = await Category.create({
//       icon: req.file.path,
//       name: req.body.name,
//       imageUrl: domain + "/img/download/" + filename,
//     });

//     if (!category) {
//       throw new Error();
//     }

//     return res
//       .status(200)
//       .json({ status: true, message: "Success", data: category });
//   } catch (error) {
//     console.log(error);
//     deleteFile(req.file);
//     return res.status(500).json({
//       status: false,
//       error: error.message || "Server Error",
//     });
//   }
// });

// //------------------------ Fetch Category Image ---------------------//
// router.get("/img", async (req,res) => {
//   gfs.find().toArray((err, files) => {
//     if (!files || files.length === 0) {
//       return res.status(200).json({
//         success : false,
//         message: 'No images available'
//       });
//     }

//     //images formates supported: [jpg, png]
//     files.map(file => {
//       if (file.contentType === 'images/jpeg' || file.contentType === 'images/png') {
//         file.isImage = false;
//       } else {
//         file.isImage = false;
//       }
//     });

//     return res.status(200).json({success: true, files});

//   });
// });

// //------------------------ Fetch Single Images ---------------------//
// router.get('/img/:filename', async (req, res) => {
//   gfs.find({filename: req.params.filename}).toArray((err, files) => {
//     if (!files[0] || files.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: 'No files available',
//       });
//     }
    
//     return res.status(200).json({
//       success: true,
//       file: files[0],
//     });

//   });
// });


// //----------------- Fetch a particular image and render on browser -------------//
// router.get('/img/d/:filename', async (req, res, next) => {
//   gfs.find({filename: req.params.filename}).toArray((err, files) => {
//     if (!files[0] || files.length === 0) {
//       return res.status(200).json({
//         success: false,
//         message: 'No files available',
//       });
//     }

//     if (file[0].contentType === 'images/jpeg' || file[0].contentType === 'images/png') {
//       gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//     } else {
//       return res.status(404).json({
//         err: 'Not an image',
//       })
//     }
//   });
// });

// router.route('/img/download/:filename')
//         .get((req, res, next) => {
//             gfs.find({ filename: req.params.filename }).toArray((err, files) => {
//                 if (!files[0] || files.length === 0) {
//                     return res.status(200).json({
//                         success: false,
//                         message: 'No files available',
//                     });
//                 }

//                 if (files[0].contentType === 'image/jpeg' || files[0].contentType === 'image/png' || files[0].contentType === 'image/svg+xml') {
//                     // render image to browser
//                     gfs.openDownloadStreamByName(req.params.filename).pipe(res);
//                 } else {
//                     return res.status(404).json({
//                         err: 'Not an image',
//                     });
//                 }
//             });
//         });


// router.route('/img/:id')
//   .delete((req, res, next) => {
//       console.log(req.params.id);
//       gfs.delete(new mongoose.Types.ObjectId(req.params.id), (err, data) => {
//           if (err) {
//               return res.status(404).json({ err: err });
//           }

//           return res.status(200).json({
//               success: true,
//               message: `File with ID ${req.params.id} is deleted`,
//           });
//       });
// });

module.exports = router;
