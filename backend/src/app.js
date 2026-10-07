const express = require("express");
const cors = require("cors");

const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  optionsSuccessStatus: 200
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cine-Stream API is running",
  });
});

app.use("/posts", postRoutes);
app.use("/users", userRoutes);

module.exports = app;