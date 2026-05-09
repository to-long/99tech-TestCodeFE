import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@test/renderWithIntl";
import ApiEndpointSection from "./ApiEndpointSection";

const originalClipboard = navigator.clipboard;

beforeEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    configurable: true,
  });
});

afterEach(() => {
  Object.defineProperty(navigator, "clipboard", {
    value: originalClipboard,
    configurable: true,
  });
});

describe("ApiEndpointSection", () => {
  it("renders the endpoint URL", () => {
    renderWithIntl(<ApiEndpointSection />);
    expect(
      screen.getByText("https://interview.switcheo.com/prices.json"),
    ).toBeInTheDocument();
  });

  it("copies the endpoint to the clipboard on click", async () => {
    renderWithIntl(<ApiEndpointSection />);
    // The copy button is the only button without an Info icon
    const buttons = screen.getAllByRole("button");
    const copyBtn = buttons[buttons.length - 1];

    await userEvent.click(copyBtn);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      "https://interview.switcheo.com/prices.json",
    );
  });
});
