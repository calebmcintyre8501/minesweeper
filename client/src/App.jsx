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
import Board from "./components/Board"
import "./App.css"

const difficulties = {
  easy: {
    rows: 10,
    columns: 10,
    mines: 10,
  },
  medium: {
    rows: 16,
    columns: 16,
    mines: 40,
  },
  hard: {
    rows: 16,
    columns: 30,
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

function App() {
  const [difficulty, setDifficulty] = useState("easy")
  const [board, setBoard] = useState(() =>
    createNewBoard("easy")
  )
  const [seconds, setSeconds] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const [gameStatus, setGameStatus] = useState("playing")
  const [gameHistory, setGameHistory] = useState([])

  useEffect(() => {
    if (!hasStarted || gameStatus !== "playing") {
      return
    }

    const timer = setInterval(() => {
      setSeconds((currentSeconds) => currentSeconds + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [hasStarted, gameStatus])

  const addGameToHistory = (result) => {
    const newGame = {
      result,
      difficulty:
        difficulty.charAt(0).toUpperCase() +
        difficulty.slice(1),
      time: seconds,
      date: new Date().toLocaleString(),
    }

    setGameHistory((currentHistory) => [
      newGame,
      ...currentHistory,
    ])
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
  }

  const handleDifficultyChange = (event) => {
    const newDifficulty = event.target.value

    setDifficulty(newDifficulty)
    setBoard(createNewBoard(newDifficulty))
    setGameStatus("playing")
    setSeconds(0)
    setHasStarted(false)
  }

  const flagCount = board
    .flat()
    .filter((cell) => cell.isFlagged)
    .length

  const minesRemaining =
    difficulties[difficulty].mines - flagCount

  return (
    <main>
      <div
        className={`game-container difficulty-${difficulty}`}
      >
        <header className="game-header">
          <h1>Minesweeper</h1>

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
                  <li key={`${game.date}-${index}`}>
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