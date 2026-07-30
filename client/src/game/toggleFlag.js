export const toggleFlag = (board, row, column) => {
  return board.map((currentRow) =>
    currentRow.map((cell) => {
      if (
        cell.row === row &&
        cell.column === column &&
        !cell.isRevealed
      ) {
        return {
          ...cell,
          isFlagged: !cell.isFlagged,
        }
      }

      return cell
    })
  )
}