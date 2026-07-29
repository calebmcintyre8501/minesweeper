import { useState } from "react";
import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMineCounts,
} from "./game/board";
import { revealCell } from "./game/revealCell";
import Board from "./components/Board";
import "./App.css";

function App() {
const [board, setBoard] = useState(() => {
  const emptyBoard = createEmptyBoard();
  const boardWithMines = placeMines(emptyBoard, 10);

  return calculateAdjacentMineCounts(boardWithMines);
});

const handleCellClick = (row, column) => {
  setBoard((currentBoard) => revealCell(currentBoard, row, column));
};

  return (
    <main>
      <div>
        <h1>Minesweeper</h1>
          <Board
            board={board}
            onCellClick={handleCellClick}
          />
      </div>
    </main>
  );
}

export default App;