import { describe, it, expect, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithIntl } from "../../../test/renderWithIntl";
import SwapTokenSelectorOverlay from "./SwapTokenSelectorOverlay";
import { useSwapStore } from "../store/useSwapStore";
import { TOKENS } from "../data/tokens";

beforeEach(() => {
  useSwapStore.setState({
    selectorOpen: null,
    fromToken: TOKENS[0],
    toToken: TOKENS[1],
  });
});

describe("SwapTokenSelectorOverlay", () => {
  it("renders nothing when selectorOpen is null", () => {
    const { container } = renderWithIntl(<SwapTokenSelectorOverlay />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the TokenSelector with the from-side selection when 'from' is open", () => {
    useSwapStore.setState({ selectorOpen: "from" });
    renderWithIntl(<SwapTokenSelectorOverlay />);
    expect(screen.getByText("Select Token")).toBeInTheDocument();
  });

  it("renders the TokenSelector when 'to' is open", () => {
    useSwapStore.setState({ selectorOpen: "to" });
    renderWithIntl(<SwapTokenSelectorOverlay />);
    expect(screen.getByText("Select Token")).toBeInTheDocument();
  });
});
