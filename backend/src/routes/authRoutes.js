const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
    }

    const [existingUserRows] = await pool.execute("SELECT id FROM users WHERE username = ? LIMIT 1", [username]);
    if (existingUserRows.length > 0) {
      return res.status(409).json({ message: "Username is already taken." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", [username, passwordHash]);

    return res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    const [userRows] = await pool.execute(
      "SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1",
      [username]
    );

    if (userRows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const user = userRows[0];
    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
