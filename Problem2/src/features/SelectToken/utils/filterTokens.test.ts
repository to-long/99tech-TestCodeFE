import { describe, expect, it } from "vitest";
import {
  filterTokens,
  partitionTokens,
  MOST_USED_COUNT,
} from "./filterTokens";
import type { Token } from "../../SwapToken/types/token";

const tokens: Token[] = [
  { symbol: "ETH", name: "Ethereum", balance: 1, image: "" },
  { symbol: "USDC", name: "USD Coin", balance: 1, image: "" },
  { symbol: "WBTC", name: "Wrapped Bitcoin", balance: 1, image: "" },
  { symbol: "SOL", name: "Solana", balance: 1, image: "" },
  { symbol: "USDT", name: "Tether", balance: 1, image: "" },
];

describe("filterTokens", () => {
  it("returns the input unchanged for an empty query", () => {
    expect(filterTokens(tokens, "")).toBe(tokens);
  });

  it("matches by symbol case-insensitively", () => {
    // "eth" matches both the ETH symbol and substring of "Tether" (USDT's name)
    const result = filterTokens(tokens, "eth");
    expect(result.map((t) => t.symbol)).toEqual(["ETH", "USDT"]);
  });

  it("matches a unique symbol exactly", () => {
    const result = filterTokens(tokens, "wbtc");
    expect(result.map((t) => t.symbol)).toEqual(["WBTC"]);
  });

  it("matches by name case-insensitively", () => {
    const result = filterTokens(tokens, "bitcoin");
    expect(result.map((t) => t.symbol)).toEqual(["WBTC"]);
  });

  it("matches partial substrings across symbol and name", () => {
    const result = filterTokens(tokens, "usd");
    expect(result.map((t) => t.symbol)).toEqual(["USDC", "USDT"]);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterTokens(tokens, "zzz")).toEqual([]);
  });
});

describe("partitionTokens", () => {
  it("splits at MOST_USED_COUNT", () => {
    const { mostUsed, available } = partitionTokens(tokens);
    expect(mostUsed).toHaveLength(MOST_USED_COUNT);
    expect(available).toHaveLength(tokens.length - MOST_USED_COUNT);
    expect(mostUsed.map((t) => t.symbol)).toEqual(["ETH", "USDC", "WBTC"]);
    expect(available.map((t) => t.symbol)).toEqual(["SOL", "USDT"]);
  });

  it("handles fewer tokens than MOST_USED_COUNT", () => {
    const { mostUsed, available } = partitionTokens(tokens.slice(0, 2));
    expect(mostUsed).toHaveLength(2);
    expect(available).toHaveLength(0);
  });

  it("handles an empty list", () => {
    const { mostUsed, available } = partitionTokens([]);
    expect(mostUsed).toEqual([]);
    expect(available).toEqual([]);
  });
});
