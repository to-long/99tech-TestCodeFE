import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "@test/renderWithIntl";
import Logo from "./Logo";

describe("Logo", () => {
  it("renders the brand name and subtitle from i18n", () => {
    renderWithIntl(<Logo />);
    expect(screen.getByText("SwapHub")).toBeInTheDocument();
    expect(screen.getByText("Decentralized Exchange")).toBeInTheDocument();
  });
});
