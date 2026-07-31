import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.post("/:username", async (request, response) => {
  try {
    const username = request.params.username.trim();
    const { difficulty, completionTime, result } = request.body;

    if (!difficulty || completionTime === undefined || !result) {
      return response.status(400).json({
        message: "Difficulty, completionTime, and result are required",
      });
    }

    const userResult = await query(
      `
        SELECT id
        FROM users
        WHERE LOWER(username) = LOWER($1)
      `,
      [username]
    );

    if (userResult.rows.length === 0) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    const userId = userResult.rows[0].id;

    const gameResult = await query(
      `
        INSERT INTO games (
          user_id,
          difficulty,
          completion_time,
          result
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          user_id,
          difficulty,
          completion_time,
          result,
          completed_at
      `,
      [userId, difficulty, completionTime, result]
    );

    return response.status(201).json(gameResult.rows[0]);
  } catch (error) {
    console.error("Unable to save game:", error);

    return response.status(500).json({
      message: "Unable to save game",
    });
  }
});

router.get("/:username", async (request, response) => {
  try {
    const username = request.params.username.trim();

    const result = await query(
      `
        SELECT
          games.id,
          games.difficulty,
          games.completion_time,
          games.result,
          games.completed_at
        FROM games
        JOIN users
          ON games.user_id = users.id
        WHERE LOWER(users.username) = LOWER($1)
        ORDER BY games.completed_at DESC
      `,
      [username]
    );

    return response.json(result.rows);
  } catch (error) {
    console.error("Unable to retrieve games:", error);

    return response.status(500).json({
      message: "Unable to retrieve games",
    });
  }
});

export default router;