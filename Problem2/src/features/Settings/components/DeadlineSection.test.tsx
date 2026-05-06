import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "../../../test/renderWithIntl";
import DeadlineSection from "./DeadlineSection";
import { useSwapStore, setDeadline } from "../../SwapToken/store/useSwapStore";

beforeEach(() => {
  setDeadline(30);
});

describe("DeadlineSection", () => {
  it("renders the current deadline", () => {
    renderWithIntl(<DeadlineSection />);
    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("commits a new positive integer value", async () => {
    renderWithIntl(<DeadlineSection />);
    await userEvent.click(screen.getByText("30"));
    const input = (await screen.findByDisplayValue("30")) as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "45");
    await userEvent.tab(); // blur to commit

    expect(useSwapStore.getState().deadline).toBe(45);
  });

  it("rejects non-numeric input and reverts to the previous value", async () => {
    renderWithIntl(<DeadlineSection />);
    await userEvent.click(screen.getByText("30"));
    const input = (await screen.findByDisplayValue("30")) as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "abc");
    await userEvent.tab();

    expect(useSwapStore.getState().deadline).toBe(30);
  });

  it("rejects zero or negative numbers", async () => {
    renderWithIntl(<DeadlineSection />);
    await userEvent.click(screen.getByText("30"));
    const input = (await screen.findByDisplayValue("30")) as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "0");
    await userEvent.tab();

    expect(useSwapStore.getState().deadline).toBe(30);
  });

  it("commits on Enter key", async () => {
    renderWithIntl(<DeadlineSection />);
    await userEvent.click(screen.getByText("30"));
    const input = (await screen.findByDisplayValue("30")) as HTMLInputElement;

    await userEvent.clear(input);
    await userEvent.type(input, "60{Enter}");

    expect(useSwapStore.getState().deadline).toBe(60);
  });
});
