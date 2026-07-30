import { useState } from "react"
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
import Board from "./components/Board"
import "./App.css"

const createNewBoard = () => {
  const emptyBoard = createEmptyBoard()
  const boardWithMines = placeMines(emptyBoard, 10)

  return calculateAdjacentMineCounts(boardWithMines)
}

function App() {
  const [board, setBoard] = useState(createNewBoard)
  const [gameStatus, setGameStatus] = useState("playing")

  const handleCellClick = (row, column) => {
    if (gameStatus !== "playing") {
      return
    }

    const clickedCell = board[row][column]

    if (clickedCell.isMine) {
      setBoard((currentBoard) => revealAllMines(currentBoard))
      setGameStatus("lost")
      return
    }

    const updatedBoard = revealCell(board, row, column)

    setBoard(updatedBoard)

    if (hasWon(updatedBoard)) {
      setGameStatus("won")
    }
  }

  const handleNewGame = () => {
    setBoard(createNewBoard())
    setGameStatus("playing")
  }

return (
  <main>
    <div className="game-container">
      <div className="game-header">
        <h1>Minesweeper</h1>

        <div className="game-info">
          <span>Mines: 10</span>

          <button type="button" onClick={handleNewGame}>
            New Game
          </button>

          <span>
            {gameStatus === "playing" && "Game in progress"}
            {gameStatus === "lost" && "Game Over"}
            {gameStatus === "won" && "You Win!"}
          </span>
        </div>
      </div>

      <Board
        board={board}
        onCellClick={handleCellClick}
      />
    </div>
  </main>
)

}

export default App