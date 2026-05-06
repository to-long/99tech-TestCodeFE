/**
 * Format a number for display.
 *
 * - `n === 0` → `"0.00"`
 * - `|n| >= 1` → fixed-decimal locale string (e.g. `1,234.56`)
 * - `|n| < 0.01` → enough decimals to surface the first significant digit
 *   plus 3 trailing digits (e.g. `0.00000123`), so very small balances aren't
 *   silently rounded to zero.
 */
export function formatAmount(n: number, minDecimals = 2): string {
  if (n === 0) return "0.00";
  const abs = Math.abs(n);
  if (abs >= 1) {
    return n.toLocaleString(undefined, {
      minimumFractionDigits: minDecimals,
      maximumFractionDigits: minDecimals,
    });
  }
  if (abs < 0.01) {
    const digits = Math.max(minDecimals, -Math.floor(Math.log10(abs)) + 3);
    return n.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }
  return n.toLocaleString(undefined, {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: minDecimals,
  });
}

/**
 * Format a token balance, preserving the original number of decimals
 * (with a minimum of 2). Used in the token selector.
 */
export function formatBalance(balance: number): string {
  const str = String(balance);
  const decimals = str.includes(".") ? str.split(".")[1].length : 0;
  const fixed = Math.max(decimals, 2);
  return balance.toLocaleString(undefined, {
    minimumFractionDigits: fixed,
    maximumFractionDigits: fixed,
  });
}
