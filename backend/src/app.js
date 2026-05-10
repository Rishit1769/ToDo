const cors = require("cors");
const express = require("express");
const authRoutes = require("./routes/authRoutes");
const todoRoutes = require("./routes/todoRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/todos", todoRoutes);

app.use((req, res) => {
  return res.status(404).json({ message: "Route not found." });
});

app.use((error, req, res, next) => {
  console.error(error);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).json({ message: "Internal server error." });
});

module.exports = app;
