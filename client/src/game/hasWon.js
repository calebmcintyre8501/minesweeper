export const hasWon = (board) => {
  return board.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed)
  )
}