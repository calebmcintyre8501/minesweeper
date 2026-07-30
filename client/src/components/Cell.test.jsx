import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Cell from "./Cell"

const hiddenCell = {
  row: 2,
  column: 3,
  isMine: false,
  isRevealed: false,
  adjacentMineCount: 0,
}

describe("Cell", () => {
  test("calls onCellClick with the cell coordinates", async () => {
    const user = userEvent.setup()
    const handleCellClick = vi.fn()

    render(
      <Cell
        cell={hiddenCell}
        onCellClick={handleCellClick}
      />
    )

    await user.click(screen.getByRole("button"))

    expect(handleCellClick).toHaveBeenCalledWith(2, 3)
    expect(handleCellClick).toHaveBeenCalledTimes(1)
  })

  test("does not display content when the cell is hidden", () => {
    render(
      <Cell
        cell={hiddenCell}
        onCellClick={() => {}}
      />
    )

    expect(screen.getByRole("button")).toHaveTextContent("")
  })

  test("displays the adjacent mine count when revealed", () => {
    const revealedCell = {
      ...hiddenCell,
      isRevealed: true,
      adjacentMineCount: 3,
    }

    render(
      <Cell
        cell={revealedCell}
        onCellClick={() => {}}
      />
    )

    const cellButton = screen.getByRole("button")

    expect(cellButton).toHaveTextContent("3")
    expect(cellButton).toHaveClass("revealed")
    expect(cellButton).toHaveClass("number-3")
  })

  test("displays a mine when a revealed cell contains a mine", () => {
    const mineCell = {
      ...hiddenCell,
      isMine: true,
      isRevealed: true,
    }

    render(
      <Cell
        cell={mineCell}
        onCellClick={() => {}}
      />
    )

    expect(screen.getByRole("button")).toHaveTextContent("💣")
  })

  test("disables a revealed cell", () => {
    const revealedCell = {
      ...hiddenCell,
      isRevealed: true,
    }

    render(
      <Cell
        cell={revealedCell}
        onCellClick={() => {}}
      />
    )

    expect(screen.getByRole("button")).toBeDisabled()
  })
})