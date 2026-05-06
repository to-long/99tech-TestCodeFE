import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SwapDirectionButton from "./SwapDirectionButton";

describe("SwapDirectionButton", () => {
  it("calls onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<SwapDirectionButton swapping={false} onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("rotates 180deg while swapping", () => {
    const { rerender } = render(<SwapDirectionButton swapping={false} onClick={() => {}} />);
    const btn = screen.getByRole("button");
    expect(btn.style.rotate).toBe("0deg");
    rerender(<SwapDirectionButton swapping onClick={() => {}} />);
    expect(btn.style.rotate).toBe("180deg");
  });
});
