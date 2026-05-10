const express = require("express");
const { pool } = require("../config/db");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authenticateToken);

router.get("/", async (req, res, next) => {
  try {
    const [todoRows] = await pool.execute(
      "SELECT id, user_id, task, is_completed, created_at FROM todos WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.userId]
    );

    return res.status(200).json(todoRows);
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { task } = req.body;

    if (!task || !task.trim()) {
      return res.status(400).json({ message: "Task is required." });
    }

    const [insertResult] = await pool.execute("INSERT INTO todos (user_id, task) VALUES (?, ?)", [
      req.user.userId,
      task.trim(),
    ]);

    const [createdRows] = await pool.execute(
      "SELECT id, user_id, task, is_completed, created_at FROM todos WHERE id = ? AND user_id = ? LIMIT 1",
      [insertResult.insertId, req.user.userId]
    );

    return res.status(201).json(createdRows[0]);
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const todoId = Number(req.params.id);

    if (!Number.isInteger(todoId) || todoId <= 0) {
      return res.status(400).json({ message: "A valid todo ID is required." });
    }

    const [todoRows] = await pool.execute(
      "SELECT id, is_completed FROM todos WHERE id = ? AND user_id = ? LIMIT 1",
      [todoId, req.user.userId]
    );

    if (todoRows.length === 0) {
      return res.status(404).json({ message: "Todo not found." });
    }

    const nextCompletedState = !Boolean(todoRows[0].is_completed);

    await pool.execute("UPDATE todos SET is_completed = ? WHERE id = ? AND user_id = ?", [
      nextCompletedState,
      todoId,
      req.user.userId,
    ]);

    return res.status(200).json({
      id: todoId,
      is_completed: nextCompletedState,
    });
  } catch (error) {
    return next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const todoId = Number(req.params.id);

    if (!Number.isInteger(todoId) || todoId <= 0) {
      return res.status(400).json({ message: "A valid todo ID is required." });
    }

    const [deleteResult] = await pool.execute("DELETE FROM todos WHERE id = ? AND user_id = ?", [
      todoId,
      req.user.userId,
    ]);

    if (deleteResult.affectedRows === 0) {
      return res.status(404).json({ message: "Todo not found." });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
