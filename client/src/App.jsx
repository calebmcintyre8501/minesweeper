import { useEffect, useState } from "react"
import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMineCounts,
} from "./game/board"
import {
  revealCell,
  revealAllMines,
} from "./game/revealCell"
import { hasWon } from "./game/hasWon"
import { toggleFlag } from "./game/toggleFlag"
import {
  getUserGames,
  loginUser,
  saveGame,
} from "./api"
import Board from "./components/Board"
import Login from "./components/Login"
import "./App.css"

const difficulties = {
  easy: {
    rows: 10,
    columns: 10,
    mines: 10,
  },
  medium: {
    rows: 15,
    columns: 15,
    mines: 30,
  },
  hard: {
    rows: 20,
    columns: 20,
    mines: 99,
  },
}

const createNewBoard = (difficulty) => {
  const settings = difficulties[difficulty]

  const emptyBoard = createEmptyBoard(
    settings.rows,
    settings.columns
  )

  const boardWithMines = placeMines(
    emptyBoard,
    settings.mines
  )

  return calculateAdjacentMineCounts(boardWithMines)
}

const formatGameFromApi = (game) => {
  return {
    id: game.id,
    result: game.result,
    difficulty:
      game.difficulty.charAt(0).toUpperCase() +
      game.difficulty.slice(1),
    time: game.completion_time,
    date: new Date(game.completed_at).toLocaleString(),
  }
}

function App() {
  const [user, setUser] = useState(null)
  const [difficulty, setDifficulty] = useState("easy")
  const [board, setBoard] = useState(() =>
    createNewBoard("easy")
  )
  const [seconds, setSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [gameStatus, setGameStatus] = useState("playing")
  const [gameHistory, setGameHistory] = useState([])
  const [saveError, setSaveError] = useState("")

  useEffect(() => {
    if (!hasStarted || gameStatus !== "playing") {
      return
    }

    const timer = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, gameStatus])

  const handleLogin = async (username) => {
    const loggedInUser = await loginUser(username)
    const savedGames = await getUserGames(
      loggedInUser.username
    )

    setUser(loggedInUser)
    setGameHistory(savedGames.map(formatGameFromApi))
  }

  const handleLogout = () => {
    setUser(null)
    setGameHistory([])
    setSaveError("")
    setDifficulty("easy")
    setBoard(createNewBoard("easy"))
    setGameStatus("playing")
    setSeconds(0)
    setHasStarted(false)
  }

  const addGameToHistory = async (result) => {
    if (!user) {
      return
    }

    try {
      setSaveError("")

      const savedGame = await saveGame(user.username, {
        result,
        difficulty,
        completionTime: seconds,
      })

      const formattedGame = formatGameFromApi(savedGame)

      setGameHistory((currentHistory) => [
        formattedGame,
        ...currentHistory,
      ])
    } catch (error) {
      console.error("Unable to save game:", error)
      setSaveError(error.message)
    }
  }

  const handleFlagCell = (row, column) => {
    if (gameStatus !== "playing") {
      return
    }

    setBoard((currentBoard) =>
      toggleFlag(currentBoard, row, column)
    )
  }

  const handleCellClick = (row, column) => {
    if (gameStatus !== "playing") {
      return
    }

    const clickedCell = board[row][column]

    if (clickedCell.isFlagged) {
      return
    }

    if (!hasStarted) {
      setHasStarted(true)
    }

    if (clickedCell.isMine) {
      setBoard((currentBoard) =>
        revealAllMines(currentBoard)
      )

      setGameStatus("lost")
      addGameToHistory("Loss")

      return
    }

    const updatedBoard = revealCell(
      board,
      row,
      column
    )

    setBoard(updatedBoard)

    if (hasWon(updatedBoard)) {
      setGameStatus("won")
      addGameToHistory("Win")
    }
  }

  const handleNewGame = () => {
    setBoard(createNewBoard(difficulty))
    setGameStatus("playing")
    setSeconds(0)
    setHasStarted(false)
    setSaveError("")
  }

  const handleDifficultyChange = (event) => {
    const newDifficulty = event.target.value

    setDifficulty(newDifficulty)
    setBoard(createNewBoard(newDifficulty))
    setGameStatus("playing")
    setSeconds(0)
    setHasStarted(false)
    setSaveError("")
  }

  const flagCount = board
    .flat()
    .filter((cell) => cell.isFlagged)
    .length

  const minesRemaining =
    difficulties[difficulty].mines - flagCount

  if (!user) {
    return <Login onLogin={handleLogin} />
  }

  return (
    <main>
      <div
        className={`game-container difficulty-${difficulty}`}
      >
        <header className="game-header">
          <div className="title-row">
            <div>
              <h1>Minesweeper</h1>
              <p className="welcome-message">
                Playing as <strong>{user.username}</strong>
              </p>
            </div>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>

          <div className="game-info">
            <span>
              Mines Remaining: {minesRemaining}
            </span>

            <div className="difficulty-control">
              <label htmlFor="difficulty">
                Difficulty:
              </label>

              <select
                id="difficulty"
                value={difficulty}
                onChange={handleDifficultyChange}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleNewGame}
            >
              New Game
            </button>

            <span className={`status status-${gameStatus}`}>
              {gameStatus === "playing" &&
                "Game in progress"}
              {gameStatus === "lost" && "Game Over"}
              {gameStatus === "won" && "You Win!"}
            </span>

            <span>Time: {seconds}s</span>
          </div>
        </header>

        {saveError && (
          <p className="save-error">
            Your game ended, but it could not be saved:{" "}
            {saveError}
          </p>
        )}

        <div className="game-layout">
          <section className="board-section">
            <Board
              board={board}
              onCellClick={handleCellClick}
              onFlagCell={handleFlagCell}
            />
          </section>

          <aside className="history">
            <h2>Game History</h2>

            {gameHistory.length === 0 ? (
              <p className="empty-history">
                No completed games yet.
              </p>
            ) : (
              <ul>
                {gameHistory.map((game, index) => (
                  <li
                    key={
                      game.id ??
                      `${game.date}-${index}`
                    }
                  >
                    <div className="history-summary">
                      <strong>{game.result}</strong>
                      <span>{game.difficulty}</span>
                      <span>{game.time}s</span>
                    </div>

                    <time>{game.date}</time>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </main>
  )
}

export default App