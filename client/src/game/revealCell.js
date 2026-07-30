export const revealCell = (board, startingRow, startingColumn) => {
  const boardCopy = board.map((row) =>
    row.map((cell) => ({ ...cell }))
  );

  const startingCell = boardCopy[startingRow][startingColumn]

  if (startingCell.isRevealed) {
    return boardCopy
  }

  if (startingCell.isMine) {
    startingCell.isRevealed = true;
    return boardCopy
  }

  const cellsToCheck = [[startingRow, startingColumn]]

  while (cellsToCheck.length > 0) {
    const [row, column] = cellsToCheck.pop()
    const currentCell = boardCopy[row][column]

    if (currentCell.isRevealed || currentCell.isMine) {
      continue
    }

    currentCell.isRevealed = true

    if (currentCell.adjacentMineCount > 0) {
      continue
    }

    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
      for (
        let columnOffset = -1;
        columnOffset <= 1;
        columnOffset++
      ) {
        if (rowOffset === 0 && columnOffset === 0) {
          continue
        }

        const neighborRow = row + rowOffset
        const neighborColumn = column + columnOffset

        const neighbor = boardCopy[neighborRow]?.[neighborColumn];

        if (
          neighbor &&
          !neighbor.isRevealed &&
          !neighbor.isMine
        ) {
          cellsToCheck.push([neighborRow, neighborColumn])
        }
      }
    }
  }

  return boardCopy
};

export const revealAllMines = (board) => {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.isMine) {
        return {
          ...cell,
          isRevealed: true,
        };
      }

      return cell;
    })
  );
};