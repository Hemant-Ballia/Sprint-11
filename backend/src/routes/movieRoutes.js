const express = require("express");

const {
  createMovie,
  getMovies,
  deleteMovie,
  getTopMovies,
} = require("../controllers/movieController");

const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("image"), createMovie);

router.get("/", getMovies);

router.get("/top", getTopMovies);

router.delete("/:id", deleteMovie);

module.exports = router;