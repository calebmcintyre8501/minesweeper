import { revealAllMines, revealCell } from "./revealCell"

const createTestBoard = () => [
  [
    {
      row: 0,
      column: 0,
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 0,
    },
    {
      row: 0,
      column: 1,
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 1,
    },
  ],
  [
    {
      row: 1,
      column: 0,
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 1,
    },
    {
      row: 1,
      column: 1,
      isMine: true,
      isRevealed: false,
      adjacentMineCount: 0,
    },
  ],
]

describe("revealCell", () => {
  test("reveals a numbered cell", () => {
    const board = createTestBoard()

    const updatedBoard = revealCell(board, 0, 1)

    expect(updatedBoard[0][1].isRevealed).toBe(true)
  })

  test("reveals connected safe cells when a blank cell is selected", () => {
    const board = createTestBoard()

    const updatedBoard = revealCell(board, 0, 0)

    expect(updatedBoard[0][0].isRevealed).toBe(true)
    expect(updatedBoard[0][1].isRevealed).toBe(true)
    expect(updatedBoard[1][0].isRevealed).toBe(true)
    expect(updatedBoard[1][1].isRevealed).toBe(false)
  })

  test("does not reveal neighboring mines", () => {
    const board = createTestBoard()

    const updatedBoard = revealCell(board, 0, 0)

    expect(updatedBoard[1][1].isRevealed).toBe(false)
  })

  test("returns a board without changing an already revealed cell", () => {
    const board = createTestBoard()
    board[0][1].isRevealed = true

    const updatedBoard = revealCell(board, 0, 1)

    expect(updatedBoard[0][1].isRevealed).toBe(true)
  })

  test("reveals only the selected mine when called directly on a mine", () => {
    const board = createTestBoard()

    const updatedBoard = revealCell(board, 1, 1)

    expect(updatedBoard[1][1].isRevealed).toBe(true)
    expect(updatedBoard[0][0].isRevealed).toBe(false)
  })

  test("does not change the original board", () => {
    const board = createTestBoard()

    revealCell(board, 0, 1)

    expect(board[0][1].isRevealed).toBe(false)
  })
})

describe("revealAllMines", () => {
  test("reveals every mine", () => {
    const board = createTestBoard()

    const updatedBoard = revealAllMines(board)

    expect(updatedBoard[1][1].isRevealed).toBe(true)
  })

  test("does not reveal safe cells", () => {
    const board = createTestBoard()

    const updatedBoard = revealAllMines(board)

    expect(updatedBoard[0][0].isRevealed).toBe(false)
    expect(updatedBoard[0][1].isRevealed).toBe(false)
    expect(updatedBoard[1][0].isRevealed).toBe(false)
  })
})