import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "../../../test/renderWithIntl";
import RefreshRateSection from "./RefreshRateSection";
import { useSwapStore, setRefreshRate } from "../../SwapToken/store/useSwapStore";

beforeEach(() => {
  setRefreshRate(10);
});

describe("RefreshRateSection", () => {
  it("highlights the current rate", () => {
    renderWithIntl(<RefreshRateSection />);
    const active = screen.getByRole("button", { name: "10s" });
    expect(active.className).toContain("bg-[var(--s-btn)]");
  });

  it("selecting a rate updates the store", async () => {
    renderWithIntl(<RefreshRateSection />);
    await userEvent.click(screen.getByRole("button", { name: "60s" }));
    expect(useSwapStore.getState().refreshRate).toBe(60);
  });
});
