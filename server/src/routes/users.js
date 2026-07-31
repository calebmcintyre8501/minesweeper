import express from "express";
import { query } from "../db.js";

const router = express.Router();

router.post("/", async (request, response) => {
  try {
    const username = request.body.username?.trim();

    if (!username) {
      return response.status(400).json({
        message: "Username is required",
      });
    }

    const result = await query(
      `
        INSERT INTO users (username)
        VALUES ($1)
        ON CONFLICT (username)
        DO UPDATE SET username = EXCLUDED.username
        RETURNING id, username, created_at
      `,
      [username]
    );

    return response.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Unable to create user:", error);

    return response.status(500).json({
      message: "Unable to create user",
    });
  }
});

router.get("/:username", async (request, response) => {
  try {
    const username = request.params.username.trim();

    const result = await query(
      `
        SELECT id, username, created_at
        FROM users
        WHERE LOWER(username) = LOWER($1)
      `,
      [username]
    );

    if (result.rows.length === 0) {
      return response.status(404).json({
        message: "User not found",
      });
    }

    return response.json(result.rows[0]);
  } catch (error) {
    console.error("Unable to retrieve user:", error);

    return response.status(500).json({
      message: "Unable to retrieve user",
    });
  }
});

export default router;