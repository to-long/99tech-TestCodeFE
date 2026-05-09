import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@test/renderWithIntl";
import SwapActionButton from "./SwapActionButton";

afterEach(() => {
  vi.useRealTimers();
});

describe("SwapActionButton", () => {
  it("renders the localized label", () => {
    renderWithIntl(<SwapActionButton />);
    expect(screen.getByRole("button", { name: /swap tokens/i })).toBeInTheDocument();
  });

  it("is disabled when the disabled prop is true", () => {
    renderWithIntl(<SwapActionButton disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not enter loading state when disabled", async () => {
    renderWithIntl(<SwapActionButton disabled />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: /swap tokens/i })).toBeInTheDocument();
  });

  it("flips to loading on click and recovers after the timeout", () => {
    vi.useFakeTimers();
    renderWithIntl(<SwapActionButton />);

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button", { name: /swapping/i })).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();

    act(() => {
      vi.advanceTimersByTime(3100);
    });
    expect(screen.getByRole("button", { name: /swap tokens/i })).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toBeDisabled();
  });
});
