import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "../../../test/renderWithIntl";
import SwapInputCard from "./SwapInputCard";

const token = { symbol: "ETH", name: "Ethereum", balance: 2.458, image: "/eth.svg" };

describe("SwapInputCard", () => {
  it("renders the editable input for variant='from'", () => {
    renderWithIntl(
      <SwapInputCard
        variant="from"
        token={token}
        amount="1.5"
        usdValue={3000}
        offset={0}
        swapping={false}
        onTokenClick={() => {}}
      />,
    );
    expect(screen.getByRole("textbox")).toHaveValue("1.5");
  });

  it("renders read-only amount for variant='to'", () => {
    renderWithIntl(
      <SwapInputCard
        variant="to"
        token={token}
        amount={1234.56}
        usdValue={123456}
        offset={0}
        swapping={false}
        onTokenClick={() => {}}
      />,
    );
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("1,234.56")).toBeInTheDocument();
  });

  it("calls onAmountChange with raw input for variant='from'", async () => {
    const onAmountChange = vi.fn();
    renderWithIntl(
      <SwapInputCard
        variant="from"
        token={token}
        amount=""
        usdValue={0}
        offset={0}
        swapping={false}
        onTokenClick={() => {}}
        onAmountChange={onAmountChange}
      />,
    );
    await userEvent.type(screen.getByRole("textbox"), "1");
    expect(onAmountChange).toHaveBeenLastCalledWith("1");
  });

  it("renders the error message and applies the red border + aria-invalid", () => {
    renderWithIntl(
      <SwapInputCard
        variant="from"
        token={token}
        amount=""
        usdValue={0}
        offset={0}
        swapping={false}
        onTokenClick={() => {}}
        errorMessage="Enter an amount"
      />,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Enter an amount");
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("does not render the error block on variant='to' even if errorMessage is given", () => {
    renderWithIntl(
      <SwapInputCard
        variant="to"
        token={token}
        amount={1}
        usdValue={1}
        offset={0}
        swapping={false}
        onTokenClick={() => {}}
        errorMessage="Should not appear"
      />,
    );
    expect(screen.queryByText("Should not appear")).not.toBeInTheDocument();
  });
});
