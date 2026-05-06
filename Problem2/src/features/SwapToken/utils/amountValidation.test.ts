import { describe, expect, it } from "vitest";
import {
  AMOUNT_ERROR_KEYS,
  MAX_DECIMALS,
  buildAmountSchema,
  sanitizeAmount,
  validateAmount,
} from "./amountValidation";

describe("sanitizeAmount", () => {
  it("strips letters and symbols", () => {
    expect(sanitizeAmount("abc1.5xyz")).toBe("1.5");
    expect(sanitizeAmount("$1,000.50")).toBe("1000.50");
    expect(sanitizeAmount("1e5")).toBe("15");
  });

  it("collapses multiple decimal points to the first", () => {
    expect(sanitizeAmount("1.5.7.9")).toBe("1.579");
    expect(sanitizeAmount("..")).toBe("0.");
    expect(sanitizeAmount("1..2")).toBe("1.2");
  });

  it("strips leading zeros except for 0 or 0.xxx", () => {
    expect(sanitizeAmount("0001.5")).toBe("1.5");
    expect(sanitizeAmount("000")).toBe("0");
    expect(sanitizeAmount("0.5")).toBe("0.5");
    expect(sanitizeAmount("0")).toBe("0");
  });

  it("clamps decimal precision to MAX_DECIMALS", () => {
    const long = "0.123456789012345678901234567890";
    const result = sanitizeAmount(long);
    expect(result.split(".")[1]).toHaveLength(MAX_DECIMALS);
    expect(result).toBe("0.123456789012345678");
  });

  it("rewrites a bare '.' as '0.'", () => {
    expect(sanitizeAmount(".")).toBe("0.");
  });

  it("returns empty for empty input", () => {
    expect(sanitizeAmount("")).toBe("");
  });

  it("preserves valid input unchanged", () => {
    expect(sanitizeAmount("1.5")).toBe("1.5");
    expect(sanitizeAmount("100")).toBe("100");
  });
});

describe("validateAmount", () => {
  const balance = 10;

  it("returns required key for empty input", () => {
    expect(validateAmount("", balance)).toBe("swap.error.required");
  });

  it("returns invalid key for unparseable input", () => {
    // sanitizeAmount runs first in production, but defensive checks still pass:
    // bare "." parses to NaN
    expect(validateAmount(".", balance)).toBe("swap.error.invalid");
  });

  it("returns tooSmall for zero or negative", () => {
    expect(validateAmount("0", balance)).toBe("swap.error.tooSmall");
    expect(validateAmount("0.0", balance)).toBe("swap.error.tooSmall");
  });

  it("returns exceedsBalance when amount > balance", () => {
    expect(validateAmount("10.01", balance)).toBe("swap.error.exceedsBalance");
    expect(validateAmount("9999", balance)).toBe("swap.error.exceedsBalance");
  });

  it("accepts amount equal to balance", () => {
    expect(validateAmount("10", balance)).toBe(true);
  });

  it("accepts a valid positive amount under balance", () => {
    expect(validateAmount("1.5", balance)).toBe(true);
    expect(validateAmount("0.000001", balance)).toBe(true);
  });
});

describe("buildAmountSchema (zod)", () => {
  it("safeParse succeeds for valid input", () => {
    const result = buildAmountSchema(10).safeParse("1.5");
    expect(result.success).toBe(true);
  });

  it("safeParse exposes the i18n key as the issue message", () => {
    const result = buildAmountSchema(10).safeParse("");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("swap.error.required");
    }
  });

  it("emits exactly one issue per failure (early-exit ordering)", () => {
    // "9999" is both > balance and a valid number — only the exceedsBalance
    // issue should surface, not earlier checks.
    const result = buildAmountSchema(10).safeParse("9999");
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].message).toBe("swap.error.exceedsBalance");
    }
  });

  it("AMOUNT_ERROR_KEYS lists every i18n key used by the schema", () => {
    expect(AMOUNT_ERROR_KEYS).toEqual([
      "swap.error.required",
      "swap.error.invalid",
      "swap.error.tooSmall",
      "swap.error.tooManyDecimals",
      "swap.error.exceedsBalance",
    ]);
  });
});
