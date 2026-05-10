import { describe, it, expect, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@test/renderWithIntl";
import SlippageSection from "./SlippageSection";
import { useSwapStore, setSlippage } from "../../SwapToken/store/useSwapStore";

beforeEach(() => {
  setSlippage(0.5);
  useSwapStore.setState({ customSlippage: "" });
});

describe("SlippageSection", () => {
  it("highlights the active preset", () => {
    renderWithIntl(<SlippageSection />);
    const active = screen.getByRole("button", { name: "0.5%" });
    expect(active.className).toContain("bg-[var(--s-btn)]");
  });

  it("clicking a preset updates the store", async () => {
    renderWithIntl(<SlippageSection />);
    await userEvent.click(screen.getByRole("button", { name: "1.0%" }));
    expect(useSwapStore.getState().slippage).toBe(1.0);
  });

  it("shows the custom input when 'Custom' is picked and writes to the store", async () => {
    renderWithIntl(<SlippageSection />);
    await userEvent.click(screen.getByRole("button", { name: /custom/i }));
    expect(useSwapStore.getState().slippage).toBe("custom");

    const input = await screen.findByPlaceholderText("0.00");
    await userEvent.type(input, "2.5");
    await waitFor(() =>
      expect(useSwapStore.getState().customSlippage).toBe("2.5"),
    );
  });

  it("strips letters from the custom input", async () => {
    renderWithIntl(<SlippageSection />);
    await userEvent.click(screen.getByRole("button", { name: /custom/i }));
    const input = (await screen.findByPlaceholderText("0.00")) as HTMLInputElement;

    await userEvent.type(input, "abc1.5xyz");

    expect(input.value).toBe("1.5");
    await waitFor(() =>
      expect(useSwapStore.getState().customSlippage).toBe("1.5"),
    );
  });

  it("clamps custom slippage to a maximum of 100%", async () => {
    renderWithIntl(<SlippageSection />);
    await userEvent.click(screen.getByRole("button", { name: /custom/i }));
    const input = (await screen.findByPlaceholderText("0.00")) as HTMLInputElement;

    await userEvent.type(input, "9999");

    expect(input.value).toBe("100");
    await waitFor(() =>
      expect(useSwapStore.getState().customSlippage).toBe("100"),
    );
  });

  it("limits custom slippage to 2 decimal places", async () => {
    renderWithIntl(<SlippageSection />);
    await userEvent.click(screen.getByRole("button", { name: /custom/i }));
    const input = (await screen.findByPlaceholderText("0.00")) as HTMLInputElement;

    await userEvent.type(input, "0.12345");

    expect(input.value).toBe("0.12");
  });

  it("collapses multiple decimal points in the custom input", async () => {
    renderWithIntl(<SlippageSection />);
    await userEvent.click(screen.getByRole("button", { name: /custom/i }));
    const input = (await screen.findByPlaceholderText("0.00")) as HTMLInputElement;

    await userEvent.type(input, "1.5.7");

    expect(input.value).toBe("1.57");
  });
});
