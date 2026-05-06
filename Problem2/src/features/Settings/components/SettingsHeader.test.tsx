import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "../../../test/renderWithIntl";
import SettingsHeader from "./SettingsHeader";
import { useSwapStore, openSettings } from "../../SwapToken/store/useSwapStore";

beforeEach(() => {
  openSettings();
});

describe("SettingsHeader", () => {
  it("renders the localized title", () => {
    renderWithIntl(<SettingsHeader />);
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("clicking close flips settingsOpen to false", async () => {
    renderWithIntl(<SettingsHeader />);
    await userEvent.click(screen.getByRole("button"));
    expect(useSwapStore.getState().settingsOpen).toBe(false);
  });
});
