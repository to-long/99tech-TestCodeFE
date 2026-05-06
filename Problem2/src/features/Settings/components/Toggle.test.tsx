import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toggle from "./Toggle";

describe("Toggle", () => {
  it("calls onChange with the inverted value when clicked", async () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("inverts in both directions", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<Toggle checked={true} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenLastCalledWith(false);

    rerender(<Toggle checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onChange).toHaveBeenLastCalledWith(true);
  });
});
