const express = require("express");
const cors = require("cors");
const movieRoutes = require("./routes/movieRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const allowedOrigins = process.env.CLIENT_URL 
  ? process.env.CLIENT_URL.split(",") 
  : ["http://localhost:3000"];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cine-Stream API is running",
  });
});

app.use("/movies", movieRoutes);
app.use("/users", userRoutes);

module.exports = app;