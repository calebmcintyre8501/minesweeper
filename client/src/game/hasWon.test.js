import { hasWon } from "./hasWon"

const createBoard = () => [
  [
    {
      row: 0,
      column: 0,
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 1,
    },
    {
      row: 0,
      column: 1,
      isMine: true,
      isRevealed: false,
      adjacentMineCount: 0,
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
      isMine: false,
      isRevealed: false,
      adjacentMineCount: 1,
    },
  ],
]

describe("hasWon", () => {
  test("returns false when safe cells are still hidden", () => {
    const board = createBoard()

    expect(hasWon(board)).toBe(false)
  })

  test("returns true when every safe cell is revealed", () => {
    const board = createBoard()

    board[0][0].isRevealed = true
    board[1][0].isRevealed = true
    board[1][1].isRevealed = true

    expect(hasWon(board)).toBe(true)
  })

  test("does not require mines to be revealed", () => {
    const board = createBoard()

    board[0][0].isRevealed = true
    board[1][0].isRevealed = true
    board[1][1].isRevealed = true

    expect(board[0][1].isRevealed).toBe(false)
    expect(hasWon(board)).toBe(true)
  })

  test("still returns true when mines are revealed", () => {
    const board = createBoard()

    board.flat().forEach((cell) => {
      cell.isRevealed = true
    })

    expect(hasWon(board)).toBe(true)
  })
})