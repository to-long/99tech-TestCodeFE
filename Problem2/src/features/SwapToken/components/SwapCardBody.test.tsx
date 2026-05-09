import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "../../../test/renderWithIntl";
import SwapCardBody from "./SwapCardBody";
import { useSwapStore } from "../store/useSwapStore";
import { TOKENS, MOCK_PRICES } from "../data/tokens";

beforeEach(() => {
  useSwapStore.setState(
    {
      fromToken: TOKENS[0], // ETH, balance 2.458
      toToken: TOKENS[1], // USDC
      fromAmount: "1.5",
      selectorOpen: null,
      settingsOpen: false,
      slippage: 0.5,
      customSlippage: "",
      network: "ethereum",
      refreshRate: 5,
      apiEndpoint: "https://interview.switcheo.com/prices.json",
      prices: MOCK_PRICES,
      fetching: false,
    },
    true,
  );
});

afterEach(() => {
  vi.useRealTimers();
});

describe("SwapCardBody — validation flow", () => {
  it("starts with a valid amount and the swap button enabled", async () => {
    renderWithIntl(<SwapCardBody />);
    const swap = screen.getByRole("button", { name: /swap tokens/i });
    await waitFor(() => expect(swap).not.toBeDisabled());
  });

  it("shows 'Enter an amount' and disables swap when input is cleared", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5");

    await userEvent.clear(input);

    expect(await screen.findByText(/enter an amount/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /swap tokens/i })).toBeDisabled();
  });

  it("strips letters and keeps the value parseable", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    // ETH balance is 2.458 — keep the result safely below it
    await userEvent.type(input, "abc1.2xyz");

    expect(input.value).toBe("1.2");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("collapses multiple decimal points to one", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "1.5.7");

    expect(input.value).toBe("1.57");
  });

  it("shows 'Insufficient ETH balance' for amounts > balance and interpolates the symbol", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "9999");

    expect(await screen.findByText(/insufficient eth balance/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /swap tokens/i })).toBeDisabled();
  });

  it("re-enables the swap button when a valid amount is entered", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    expect(screen.getByRole("button", { name: /swap tokens/i })).toBeDisabled();

    await userEvent.type(input, "1.0");
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /swap tokens/i })).not.toBeDisabled(),
    );
  });

  it("shows 'Amount must be greater than 0' for zero", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "0");

    expect(await screen.findByText(/greater than 0/i)).toBeInTheDocument();
  });

  it("syncs sanitized values back into the store", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "abc0.7xyz");

    await waitFor(() =>
      expect(useSwapStore.getState().fromAmount).toBe("0.7"),
    );
  });

  it("re-runs validation when the from token changes (different balance)", async () => {
    renderWithIntl(<SwapCardBody />);
    const input = screen.getByDisplayValue("1.5") as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "100");
    // 100 > ETH balance (2.458) — error shown
    expect(await screen.findByText(/insufficient eth balance/i)).toBeInTheDocument();

    // Switch to USDC (balance 5420), 100 is now valid
    act(() => {
      useSwapStore.setState({ fromToken: TOKENS[1] });
    });
    await waitFor(() =>
      expect(screen.queryByText(/insufficient/i)).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("button", { name: /swap tokens/i })).not.toBeDisabled();
  });
});
