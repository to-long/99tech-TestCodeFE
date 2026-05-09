import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SectionHeader from "./SectionHeader";
import { renderWithIntl } from "@test/renderWithIntl";

describe("SectionHeader", () => {
  it("renders the label", () => {
    renderWithIntl(<SectionHeader label="Slippage" tooltip="hint" />);
    expect(screen.getByText("Slippage")).toBeInTheDocument();
  });

  it("toggles the tooltip on click", async () => {
    renderWithIntl(<SectionHeader label="Slippage" tooltip="The hint text" />);

    expect(screen.queryByText("The hint text")).not.toBeInTheDocument();

    const button = screen.getByRole("button");
    await userEvent.click(button);
    expect(screen.getByText("The hint text")).toBeInTheDocument();

    await userEvent.click(button);
    expect(screen.queryByText("The hint text")).not.toBeInTheDocument();
  });

  it("hides the tooltip on outside click", async () => {
    renderWithIntl(<SectionHeader label="Slippage" tooltip="The hint text" />);
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("The hint text")).toBeInTheDocument();

    await userEvent.click(document.body);
    expect(screen.queryByText("The hint text")).not.toBeInTheDocument();
  });
});
