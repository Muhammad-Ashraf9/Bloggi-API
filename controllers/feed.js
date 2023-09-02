const { validationResult } = require("express-validator");
const Post = require("../models/post");
const fs = require("fs");
const path = require("path");
const User = require("../models/user");
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
  try {
    const { postId } = req.params;
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
  try {
    const validatedResultOfRequest = validationResult(req);
    const { title, content } = req.body;
    const authorId = req.userId;
    const imageUrl = req.file?.path;
    if (!imageUrl) throw Error("No image uploaded");
    if (!validatedResultOfRequest.isEmpty()) {
      removeFile(getImageFullPath(req.file.filename));
      throw validatedResultOfRequest.array();
    }
    const post = new Post({
      title: title,
      content: content,
      author: authorId,
      imageUrl: imageUrl,
    });
    const savedPost = await post.save();
    if (!savedPost) throw new Error("post not saved, try again later.");
    const author = await User.findById(authorId);
    if (!author) throw new Error("post saved but not to user.");
    author.posts.push(savedPost._id);
    const updatedUser = await author.save();
    if (!updatedUser) {
      await Post.findByIdAndDelete(savedPost._id);
      throw Error("Could't save post,");
    }
    res.status(201).json({
      post: savedPost,
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
  try {
    const foundPost = await Post.findById(postId);
    if (!foundPost) throw new Error("Post Not Found.");
    if (foundPost.author.toString() !== req.userId.toString()) {
      image && removeFile(image.path);
      throw new Error("Not Authorized to update post.");
    }
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
    const [user, post] = await Promise.all([
      User.findById(req.userId),
      Post.findById(postId),
    ]);
    if (!post) throwNotFoundError("Post not found");
    if (!user || user._id.toString() !== post.author.toString())
      throw new Error("Not Authorized to delete post.");
    const deletedPost = await Post.findByIdAndDelete(postId);
    user.posts.pull(postId);
    const savedUser = await user.save();
    if (!savedUser || !deletedPost) throw new Error("Couldn't delete post");
    //add post again if user not saved
    removeFile(deletedPost.imageUrl);
    return res.status(200).json({ deletedPost });
  } catch (error) {
    next(error);
  }
};
