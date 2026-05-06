import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenSearchInput from "./TokenSearchInput";

describe("TokenSearchInput", () => {
  it("renders the placeholder and current value", () => {
    render(<TokenSearchInput value="abc" placeholder="Search…" onChange={() => {}} />);
    const input = screen.getByPlaceholderText("Search…") as HTMLInputElement;
    expect(input.value).toBe("abc");
  });

  it("calls onChange with each typed character", async () => {
    const onChange = vi.fn();
    render(<TokenSearchInput value="" placeholder="Search…" onChange={onChange} />);
    await userEvent.type(screen.getByPlaceholderText("Search…"), "abc");
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange).toHaveBeenLastCalledWith("c");
  });
});
