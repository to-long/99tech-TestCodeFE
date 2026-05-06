import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "../../../test/renderWithIntl";
import TokenSelector from "./TokenSelector";

describe("TokenSelector", () => {
  it("renders the title and the search input", () => {
    renderWithIntl(
      <TokenSelector selectedSymbol="ETH" onSelect={() => {}} onClose={() => {}} />,
    );
    expect(screen.getByText("Select Token")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it("filters tokens via the search input", async () => {
    renderWithIntl(
      <TokenSelector selectedSymbol="ETH" onSelect={() => {}} onClose={() => {}} />,
    );
    await userEvent.type(screen.getByPlaceholderText(/search/i), "wbtc");
    await waitFor(() => {
      expect(screen.getByText("WBTC")).toBeInTheDocument();
    });
    expect(screen.queryByText("Solana")).not.toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed (after exit animation)", async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderWithIntl(
      <TokenSelector selectedSymbol="ETH" onSelect={() => {}} onClose={onClose} />,
    );
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    vi.advanceTimersByTime(260);
    expect(onClose).toHaveBeenCalled();
    vi.useRealTimers();
  });
});
