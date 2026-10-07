const express = require("express");

const {
  createPost,
  getPosts,
  deletePost,
  getTopPosts,
} = require("../controllers/postController");

const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("image"), createPost);

router.get("/", getPosts);

router.get("/top", getTopPosts);

router.delete("/:id", deletePost);

module.exports = router;