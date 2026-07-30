import { render, screen } from "@testing-library/react"
import Board from "./Board"

const testBoard = [
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

describe("Board", () => {
  test("renders one button for every cell", () => {
    render(
      <Board
        board={testBoard}
        onCellClick={() => {}}
      />
    )

    const cells = screen.getAllByRole("button")

    expect(cells).toHaveLength(4)
  })

  test("renders revealed cell content", () => {
    const revealedBoard = testBoard.map((row) =>
      row.map((cell) => ({ ...cell }))
    )

    revealedBoard[0][1].isRevealed = true
    revealedBoard[1][1].isRevealed = true

    render(
      <Board
        board={revealedBoard}
        onCellClick={() => {}}
      />
    )

    expect(screen.getByText("1")).toBeInTheDocument()
    expect(screen.getByText("💣")).toBeInTheDocument()
  })
})