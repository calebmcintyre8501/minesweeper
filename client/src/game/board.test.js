import {
  createEmptyBoard,
  placeMines,
  calculateAdjacentMineCounts,
} from "./board"

describe("createEmptyBoard", () => {
  test("creates a board with the correct number of rows and columns", () => {
    const board = createEmptyBoard(3, 4)

    expect(board).toHaveLength(3)
    expect(board[0]).toHaveLength(4)
  })

  test("creates cells with the correct default values", () => {
    const board = createEmptyBoard(2, 2)

    expect(board[0][0]).toEqual({
      row: 0,
      column: 0,
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 0,
    })

    expect(board[1][1]).toEqual({
      row: 1,
      column: 1,
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 0,
    })
  })
})

describe("placeMines", () => {
  test("places the requested number of mines", () => {
    const board = createEmptyBoard(5, 5)
    const boardWithMines = placeMines(board, 5)

    const mineCount = boardWithMines
      .flat()
      .filter((cell) => cell.isMine).length

    expect(mineCount).toBe(5)
  })

  test("does not change the original board", () => {
    const board = createEmptyBoard(3, 3)

    placeMines(board, 2)

    const mineCount = board
      .flat()
      .filter((cell) => cell.isMine).length

    expect(mineCount).toBe(0)
  })
})

describe("calculateAdjacentMineCounts", () => {
  test("calculates the number of nearby mines", () => {
    const board = createEmptyBoard(3, 3)

    board[0][0].isMine = true
    board[0][2].isMine = true

    const updatedBoard = calculateAdjacentMineCounts(board)

    expect(updatedBoard[0][1].adjacentMineCount).toBe(2)
    expect(updatedBoard[1][0].adjacentMineCount).toBe(1)
    expect(updatedBoard[1][1].adjacentMineCount).toBe(2)
    expect(updatedBoard[2][2].adjacentMineCount).toBe(0)
  })

  test("does not assign a count to mine cells", () => {
    const board = createEmptyBoard(2, 2)

    board[0][0].isMine = true

    const updatedBoard = calculateAdjacentMineCounts(board)

    expect(updatedBoard[0][0].isMine).toBe(true)
    expect(updatedBoard[0][0].adjacentMineCount).toBe(0)
  })
})