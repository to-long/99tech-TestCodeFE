import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TokenBadge from "./TokenBadge";

const token = { symbol: "ETH", name: "Ethereum", balance: 1, image: "/eth.svg" };

describe("TokenBadge", () => {
  it("renders symbol and name", () => {
    render(<TokenBadge token={token} onClick={() => {}} />);
    expect(screen.getByText("ETH")).toBeInTheDocument();
    expect(screen.getByText("Ethereum")).toBeInTheDocument();
  });

  it("invokes onClick when clicked", async () => {
    const onClick = vi.fn();
    render(<TokenBadge token={token} onClick={onClick} />);
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
