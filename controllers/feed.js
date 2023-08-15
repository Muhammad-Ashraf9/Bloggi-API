const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
function removeFile(path) {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
}
function throwNotFoundError(msg) {
  const err = new Error(msg);
  err.statusCode = 404;
  throw err;
}
function getImageFullPath(imgName) {
  return path.join(__dirname, "..", "images", imgName);
}
//GET
exports.getPosts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const posts = await Post.find({ ...req.query })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }); // We sort the data by the date of their creation in descending order

    const count = await Post.countDocuments();
    return res.status(200).json({
      posts,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    next(err);
  }
};
exports.getPostDetails = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) throwNotFoundError("Post not found");
    return res.status(200).json({
      post,
    });
  } catch (err) {
    next(err);
  }
};

//POST
exports.postPosts = async (req, res, next) => {
  const vlaidatedResultOfRequest = validationResult(req);
  const { title, content, author } = req.body;
  const imageUrl = req.file?.path;
  try {
    if (!vlaidatedResultOfRequest.isEmpty()) {
      removeFile(getImageFullPath(req.file.filename));
      return res.status(403).json({ errors: vlaidatedResultOfRequest.array() });
    }
    if (!imageUrl) return res.status(403).json({ error: "No image uploaded" });
    const post = new Post({
      title: title,
      content: content,
      author: author,
      imageUrl: imageUrl,
    });

    const savedPost = await post.save();
    if (!savedPost) throw new Error("post not saved, try again later.");
    res.status(201).json({
      post,
    });
  } catch (error) {
    next(error);
  }
};

//PUT
exports.editPost = async (req, res, next) => {
  const { postId } = req.params;
  const { title, content, author } = req.body;
  const image = req.file;
  console.log(image);
  try {
    const foundPost = await Post.findById(postId);
    const imageUrl = image?.path || foundPost.imageUrl;
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        title,
        author,
        content,
        imageUrl,
      },
      { new: true }
    );
    if (image) removeFile(foundPost.imageUrl);
    return res.status(200).json({ updatedPost });
  } catch (error) {
    next(error);
  }
};
exports.deletePost = async (req, res, next) => {
  const { postId } = req.params;
  try {
    const deletedPost = await Post.findByIdAndDelete(postId);
    if (!deletedPost) throwNotFoundError("Post not found");
    removeFile(deletedPost.imageUrl);
    return res.status(200).json({ deletedPost });
  } catch (error) {
    next(error);
  }
};
