const mongoose = require("mongoose");
const Post = require("../models/Post");
const cloudinary = require("../config/cloudinary");

const createPost = async (req, res) => {
  try {
    const { title, content, authorId } = req.body;

    if (!title || !content || !authorId) {
      return res.status(400).json({
        success: false,
        message: "Title, content and authorId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid authorId",
      });
    }

    let imageUrl = "";

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "sprint-11-posts",
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const post = await Post.create({
      title,
      content,
      authorId,
      imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create post",
      error: error.message,
    });
  }
};

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch posts",
      error: error.message,
    });
  }
};

const getTopPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("authorId", "name email")
      .sort({ createdAt: -1 })
      .limit(3);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch top posts",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID",
      });
    }

    const post = await Post.findByIdAndDelete(id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete post",
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getPosts,
  getTopPosts,
  deletePost,
};