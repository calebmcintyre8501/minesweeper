import "./Cell.css"

function Cell({ cell, onCellClick, onFlagCell }) {
  let cellContent = ""

  if (cell.isFlagged && !cell.isRevealed) {
    cellContent = "🚩"
  } else if (cell.isRevealed && cell.isMine) {
    cellContent = "💣"
  } else if (
    cell.isRevealed &&
    cell.adjacentMineCount > 0
  ) {
    cellContent = cell.adjacentMineCount
  }

  const numberClass =
    cell.isRevealed &&
    !cell.isMine &&
    cell.adjacentMineCount > 0
      ? `number-${cell.adjacentMineCount}`
      : ""

  const handleRightClick = (event) => {
    event.preventDefault()
    onFlagCell(cell.row, cell.column)
  }

  return (
    <button
      className={`cell ${
        cell.isRevealed ? "revealed" : ""
      } ${numberClass}`}
      type="button"
      onClick={() =>
        onCellClick(cell.row, cell.column)
      }
      onContextMenu={handleRightClick}
      disabled={cell.isRevealed}
    >
      {cellContent}
    </button>
  )
}

export default Cell