import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenRow from "./TokenRow";
import type { Token } from "../../SwapToken/types/token";

const token: Token = {
  symbol: "ETH",
  name: "Ethereum",
  balance: 2.458,
  image: "/eth.svg",
};

describe("TokenRow", () => {
  it("renders symbol, name, and formatted balance", () => {
    render(<TokenRow token={token} isSelected={false} onSelect={() => {}} />);
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
    expect(screen.getByText("2.458")).toBeInTheDocument();
  });

  it("calls onSelect with the token when clicked", async () => {
    const onSelect = vi.fn();
    render(<TokenRow token={token} isSelected={false} onSelect={onSelect} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onSelect).toHaveBeenCalledWith(token);
  });

  it("highlights when isSelected", () => {
    render(<TokenRow token={token} isSelected onSelect={() => {}} />);
    expect(screen.getByRole("button").className).toContain("bg-[var(--s-highlight)]");
  });
});
