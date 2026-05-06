import { describe, expect, it } from "vitest";
import { formatAmount, formatBalance } from "./formatNumber";

describe("formatAmount", () => {
  it("returns '0.00' for zero", () => {
    expect(formatAmount(0)).toBe("0.00");
  });

  it("formats numbers >= 1 with the requested fixed decimals", () => {
    expect(formatAmount(1)).toBe("1.00");
    expect(formatAmount(1234.567)).toBe("1,234.57");
    expect(formatAmount(1234.5)).toBe("1,234.50");
  });

  it("formats numbers between 0.01 and 1 with the requested decimals", () => {
    expect(formatAmount(0.5)).toBe("0.50");
    expect(formatAmount(0.99)).toBe("0.99");
    expect(formatAmount(0.01)).toBe("0.01");
  });

  it("expands precision for very small numbers to surface the first significant digit", () => {
    // Formula: max(minDecimals, -floor(log10(abs)) + 3) decimal places.
    // 0.00000123 → 6+3 = 9 decimals
    expect(formatAmount(0.00000123)).toBe("0.000001230");
    // 0.0001 → 4+3 = 7 decimals
    expect(formatAmount(0.0001)).toBe("0.0001000");
    // 0.001 → 3+3 = 6 decimals
    expect(formatAmount(0.001)).toBe("0.001000");
  });

  it("respects negative values", () => {
    expect(formatAmount(-1.5)).toBe("-1.50");
    expect(formatAmount(-0.0001)).toBe("-0.0001000");
  });

  it("honours a custom minDecimals", () => {
    expect(formatAmount(1, 4)).toBe("1.0000");
    expect(formatAmount(0, 4)).toBe("0.00"); // zero short-circuit
  });
});

describe("formatBalance", () => {
  it("preserves the original decimals (minimum 2)", () => {
    expect(formatBalance(2.458)).toBe("2.458");
    expect(formatBalance(2.4)).toBe("2.40");
    expect(formatBalance(5420)).toBe("5,420.00");
  });

  it("works with integers", () => {
    expect(formatBalance(0)).toBe("0.00");
    expect(formatBalance(100)).toBe("100.00");
  });
});
