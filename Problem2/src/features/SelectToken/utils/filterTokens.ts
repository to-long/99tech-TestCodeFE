import type { Token } from "../../SwapToken/types/token";

export const MOST_USED_COUNT = 3;

export function filterTokens(tokens: Token[], query: string): Token[] {
  const q = query.toLowerCase();
  if (!q) return tokens;
  return tokens.filter(
    (t) => t.symbol.toLowerCase().includes(q) || t.name.toLowerCase().includes(q),
  );
}

export function partitionTokens(tokens: Token[]): {
  mostUsed: Token[];
  available: Token[];
} {
  return {
    mostUsed: tokens.slice(0, MOST_USED_COUNT),
    available: tokens.slice(MOST_USED_COUNT),
  };
}
