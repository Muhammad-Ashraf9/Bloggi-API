const express = require("express");
const bodyParser = require("body-parser");
const { body } = require("express-validator");
const upload = require("../middlewares/multer");
const {
  postPosts,
  getPosts,
  getPostDetails,
  editPost,
  deletePost,
} = require("../controllers/feed");
const { postValidator } = require("../middlewares/validators");
const { isAuth } = require("../controllers/auth");

// const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false });

const router = express.Router();

//get
//    /feed/posts
router.get("/posts", isAuth, getPosts);

router.get("/posts/:postId", isAuth, getPostDetails);

//Post
//    /feed/posts
//arrangement of middlewares   multer(as it parses the multipart/data form) before validator otherwise cause error
router.post("/posts", upload.single("image"), postValidator(), postPosts);

//PUT
router.put("/posts/:postId", upload.single("image"), postValidator(), editPost);

//DELETE
router.delete("/posts/:postId", deletePost);

module.exports = router;
