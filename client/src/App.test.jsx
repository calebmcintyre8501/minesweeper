import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import App from "./App"

vi.mock("./game/board", () => ({
  createEmptyBoard: vi.fn(() => [
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
  ]),
  placeMines: vi.fn((board) => board),
  calculateAdjacentMineCounts: vi.fn((board) => board),
}))

describe("App", () => {
  test("renders the game heading and status", () => {
    render(<App />)

    expect(
      screen.getByRole("heading", { name: "Minesweeper" })
    ).toBeInTheDocument()

    expect(screen.getByText("Game in progress")).toBeInTheDocument()
    expect(screen.getByText("Mines: 10")).toBeInTheDocument()
  })

  test("shows Game Over when a mine is clicked", async () => {
    const user = userEvent.setup()

    render(<App />)

    const cells = screen.getAllByRole("button")
    const mineCell = cells[2]

    await user.click(mineCell)

    expect(screen.getByText("Game Over")).toBeInTheDocument()
    expect(screen.getByText("💣")).toBeInTheDocument()
  })

  test("starts a new game when New Game is clicked", async () => {
    const user = userEvent.setup()

    render(<App />)

    const cells = screen.getAllByRole("button")
    const mineCell = cells[2]

    await user.click(mineCell)

    expect(screen.getByText("Game Over")).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: "New Game" })
    )

    expect(screen.getByText("Game in progress")).toBeInTheDocument()
    expect(screen.queryByText("Game Over")).not.toBeInTheDocument()
  })

  test("shows You Win when every safe cell is revealed", async () => {
    const user = userEvent.setup()

    render(<App />)

    const cells = screen.getAllByRole("button")
    const safeCell = cells[1]

    await user.click(safeCell)

    expect(screen.getByText("You Win!")).toBeInTheDocument()
  })
})