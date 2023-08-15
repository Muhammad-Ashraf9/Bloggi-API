const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const allPosts = await Post.find({});
    res.status(200).json({
      posts: allPosts,
    });
  } catch (error) {
    throw error;
  }
};
exports.postPosts = async (req, res, next) => {
  const result = validationResult(req);
  const { title, content, author } = req.body;
  const imageUrl = req.file?.path;
  if (!imageUrl) throw new Error("no image uploaded");
  const post = new Post({
    title: title,
    content: content,
    author: author,
    imageUrl: imageUrl,
  });
  try {
    const savedPost = await post.save();
    if (!savedPost) throw new Error("post not saved, try again later.");
    res.status(200).json({
      content: "posted",
      post: post,
    });
  } catch (error) {
    throw error;
  }
};
