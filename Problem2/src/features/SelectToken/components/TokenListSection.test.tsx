import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenListSection from "./TokenListSection";
import type { Token } from "../../SwapToken/types/token";

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: 1, image: "" },
  { symbol: "USDC", name: "USD Coin", balance: 100, image: "" },
];

describe("TokenListSection", () => {
  it("renders the label and each token row", () => {
    render(
      <TokenListSection
        label="Most Used"
        tokens={tokens}
        selectedSymbol="ETH"
        onSelect={() => {}}
      />,
    );
    expect(screen.getByText("Most Used")).toBeInTheDocument();
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("USDC")).toBeInTheDocument();
  });

  it("delegates onSelect to the clicked token", async () => {
    const onSelect = vi.fn();
    render(
      <TokenListSection
        label="Most Used"
        tokens={tokens}
        selectedSymbol="ETH"
        onSelect={onSelect}
      />,
    );
    await userEvent.click(screen.getByText("USDC"));
    expect(onSelect).toHaveBeenCalledWith(tokens[1]);
  });

  it("renders nothing when tokens are empty", () => {
    const { container } = render(
      <TokenListSection
        label="Empty"
        tokens={[]}
        selectedSymbol="ETH"
        onSelect={() => {}}
      />,
    );
    expect(container.firstChild).toBeNull();
  });
});
