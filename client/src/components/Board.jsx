import Cell from "./Cell"
import "./Board.css"

function Board({ board, onCellClick }) {
  return (
    <section className="board">
      {board.map((row, rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {row.map((cell) => (
            <Cell
              key={`${cell.row}-${cell.column}`}
              cell={cell}
              onCellClick={onCellClick}
            />
          ))}
        </div>
      ))}
    </section>
  );
}

export default Board