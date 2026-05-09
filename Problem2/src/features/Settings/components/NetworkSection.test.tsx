import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@test/renderWithIntl";
import NetworkSection from "./NetworkSection";
import { useSwapStore, setNetwork } from "../../SwapToken/store/useSwapStore";

beforeEach(() => {
  setNetwork("ethereum");
});

describe("NetworkSection", () => {
  it("shows the current network in the trigger", () => {
    renderWithIntl(<NetworkSection />);
    expect(screen.getAllByText("Ethereum").length).toBeGreaterThan(0);
  });

  it("opens the dropdown and selects a different network", async () => {
    renderWithIntl(<NetworkSection />);
    // Click trigger (the first button)
    const triggers = screen.getAllByRole("button");
    await userEvent.click(triggers[1]); // [0] is the SectionHeader info icon

    const polygonRow = await screen.findByText("Polygon");
    await userEvent.click(polygonRow);
    expect(useSwapStore.getState().network).toBe("polygon");
  });
});
