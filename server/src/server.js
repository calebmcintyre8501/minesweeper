import cors from "cors"
import dotenv from "dotenv"
import express from "express"
import gamesRouter from "./routes/games.js"
import usersRouter from "./routes/users.js"
import { query } from "./db.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001

app.use(cors());
app.use(express.json());

app.use("/api/users", usersRouter);
app.use("/api/games", gamesRouter);

app.get("/api/health", async (request, response) => {
  try {
    const result = await query(
      "SELECT NOW() AS current_time"
    )

    response.json({
      message: "Minesweeper API is running",
      database: "connected",
      time: result.rows[0].current_time,
    })
  } catch (error) {
    console.error(error)

    response.status(500).json({
      message: "API is running",
      database: "connection failed",
    })
  }
})

app.use("/api/users", usersRouter)
app.use("/api/games", gamesRouter)

app.use((request, response) => {
  response.status(404).json({
    error: "Route not found",
  })
})

app.listen(port, () => {
  console.log(
    `Minesweeper API running on http://localhost:${port}`
  )
})