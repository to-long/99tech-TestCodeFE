import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import NetworkIcon from "./NetworkIcon";
import { NETWORKS } from "../data/networks";

describe("NetworkIcon", () => {
  it("renders the network's icon character", () => {
    render(<NetworkIcon network={NETWORKS[0]} />);
    expect(screen.getByText(NETWORKS[0].icon)).toBeInTheDocument();
  });

  it("uses the network's color for the background", () => {
    render(<NetworkIcon network={NETWORKS[1]} />);
    const span = screen.getByText(NETWORKS[1].icon);
    const circle = span.parentElement!;
    expect(circle.style.backgroundColor).toBeTruthy();
  });

  it("renders smaller dimensions when size='sm'", () => {
    render(<NetworkIcon network={NETWORKS[0]} size="sm" />);
    const circle = screen.getByText(NETWORKS[0].icon).parentElement!;
    expect(circle.className).toContain("h-3");
    expect(circle.className).toContain("w-3");
  });

  it("renders default dimensions when size is omitted", () => {
    render(<NetworkIcon network={NETWORKS[0]} />);
    const circle = screen.getByText(NETWORKS[0].icon).parentElement!;
    expect(circle.className).toContain("h-6");
    expect(circle.className).toContain("w-6");
  });
});
