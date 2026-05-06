import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ToggleRow from "./ToggleRow";

describe("ToggleRow", () => {
  it("renders the label and description", () => {
    render(
      <ToggleRow
        label="Expert Mode"
        description="Allow high slippage"
        checked={false}
        onChange={() => {}}
      />,
    );
    expect(screen.getByText("Expert Mode")).toBeInTheDocument();
    expect(screen.getByText("Allow high slippage")).toBeInTheDocument();
  });

  it("invokes onChange when the toggle is clicked", async () => {
    const onChange = vi.fn();
    render(
      <ToggleRow
        label="Expert Mode"
        description="Allow high slippage"
        checked={false}
        onChange={onChange}
      />,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});
