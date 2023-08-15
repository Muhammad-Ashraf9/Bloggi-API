const express = require("express");
const bodyParser = require("body-parser");
const { body } = require("express-validator");
const multer = require("multer");
// const upload = multer({ dest: "./images" });
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
function fileFilter(req, file, cb) {
  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });

const { getPosts, postPosts } = require("../controllers/feed");

// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();

//get
//    /feed/posts
router.get("/posts", getPosts);

//Post
//    /feed/posts
router.post(
  "/posts",
  upload.single("image"),

  //   body("title")
  //     .trim()
  //     .isLength({ min: 5 })
  //     .withMessage("title length should be 5 "),
  //   jsonParser,
  postPosts
);

module.exports = router;
