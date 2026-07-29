export const createEmptyBoard = (rows = 10, columns = 10) => {
  const board = [];

  for (let row = 0; row < rows; row++) {
    const currentRow = [];

    for (let column = 0; column < columns; column++) {
      currentRow.push({
        row,
        column,
        isMine: false,
        isRevealed: false,
        adjacentMineCount: 0,
      });
    }

    board.push(currentRow);
  }

  return board;
};

export const placeMines = (board, mineCount = 10) => {
  const boardCopy = board.map((row) =>
    row.map((cell) => ({ ...cell }))
  );

  let minesPlaced = 0;

  while (minesPlaced < mineCount) {
    const randomRow = Math.floor(Math.random() * boardCopy.length);
    const randomColumn = Math.floor(
      Math.random() * boardCopy[randomRow].length
    );

    if (!boardCopy[randomRow][randomColumn].isMine) {
      boardCopy[randomRow][randomColumn].isMine = true;
      minesPlaced++;
    }
  }

  return boardCopy;
};

export const calculateAdjacentMineCounts = (board) => {
  return board.map((row) =>
    row.map((cell) => {
      if (cell.isMine) {
        return cell;
      }

      let mineCount = 0;

      for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (
          let columnOffset = -1;
          columnOffset <= 1;
          columnOffset++
        ) {
          if (rowOffset === 0 && columnOffset === 0) {
            continue;
          }

          const neighborRow = cell.row + rowOffset;
          const neighborColumn = cell.column + columnOffset;

          const neighbor = board[neighborRow]?.[neighborColumn];

          if (neighbor?.isMine) {
            mineCount++;
          }
        }
      }

      return {
        ...cell,
        adjacentMineCount: mineCount,
      };
    })
  );
};