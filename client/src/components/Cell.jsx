import "./Cell.css";

function Cell({ cell, onCellClick }) {
  let cellContent = "";

  if (cell.isRevealed && cell.isMine) {
    cellContent = "💣";
  } else if (cell.isRevealed && cell.adjacentMineCount > 0) {
    cellContent = cell.adjacentMineCount;
  }

  const numberClass =
    cell.isRevealed && !cell.isMine && cell.adjacentMineCount > 0
      ? `number-${cell.adjacentMineCount}`
      : "";

  return (
    <button
      className={`cell ${cell.isRevealed ? "revealed" : ""} ${numberClass}`}
      type="button"
      onClick={() => onCellClick(cell.row, cell.column)}
    >
      {cellContent}
    </button>
  );
}

export default Cell;