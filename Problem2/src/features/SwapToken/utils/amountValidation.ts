/**
 * Amount-input sanitization and validation for the swap "from" field.
 *
 * `sanitizeAmount` is applied at every keystroke to block invalid characters
 * (letters, multiple decimal points, more than `MAX_DECIMALS` decimal digits,
 * stray leading zeros). `amountSchema` is the `zod` schema that backs
 * `validateAmount`, which returns either `true` or an i18n error key so the
 * UI can render a localized message.
 */
import { z } from "zod";

/** Maximum decimal precision we accept. ERC-20 tokens go up to 18; this is a safe ceiling. */
export const MAX_DECIMALS = 18;

export const AMOUNT_ERROR_KEYS = [
  "swap.error.required",
  "swap.error.invalid",
  "swap.error.tooSmall",
  "swap.error.tooManyDecimals",
  "swap.error.exceedsBalance",
] as const;

export type AmountErrorKey = (typeof AMOUNT_ERROR_KEYS)[number];

/**
 * Strip everything that isn't a digit or a single decimal point, drop
 * leading zeros, and clamp decimal precision. Safe to run on every
 * `onChange` and on pasted input.
 *
 * `maxDecimals` defaults to `MAX_DECIMALS` (18, the ERC-20 ceiling) for
 * swap amounts; pass a smaller value for narrower inputs (e.g. `2` for
 * slippage percentages).
 */
export function sanitizeAmount(
  input: string,
  maxDecimals: number = MAX_DECIMALS,
): string {
  // Only digits and dots
  let cleaned = input.replace(/[^\d.]/g, "");

  // Collapse multiple dots — keep the first
  const firstDot = cleaned.indexOf(".");
  if (firstDot !== -1) {
    cleaned =
      cleaned.slice(0, firstDot + 1) +
      cleaned.slice(firstDot + 1).replace(/\./g, "");
  }

  // Limit decimal places
  if (firstDot !== -1) {
    const [whole, decimals = ""] = cleaned.split(".");
    if (decimals.length > maxDecimals) {
      cleaned = `${whole}.${decimals.slice(0, maxDecimals)}`;
    }
  }

  // Strip leading zeros, keeping "0" or "0.xxx"
  if (cleaned.length > 1 && cleaned[0] === "0" && cleaned[1] !== ".") {
    cleaned = cleaned.replace(/^0+/, "") || "0";
  }

  // Treat a bare "." as "0."
  if (cleaned === ".") cleaned = "0.";

  return cleaned;
}

/** Matches digits with at most one decimal point: "", "1", "1.", ".5", "1.23" all OK. */
const AMOUNT_PATTERN = /^\d*\.?\d*$/;

/**
 * Build a `zod` schema for the swap "from amount" against a given balance.
 *
 * Each rule uses the most idiomatic zod combinator:
 * - `.min(1)` catches an empty string
 * - `.regex(AMOUNT_PATTERN)` catches stray characters / format issues
 * - `.refine(decimals)` enforces the ERC-20 18-decimal ceiling
 * - `.transform()` parses to a number (so the rest of the chain works in
 *   numeric space) and emits an extra "invalid" issue for edge cases the
 *   regex misses (e.g. a bare ".")
 * - `.pipe(z.number().positive().max(balance))` covers ≤ 0 and > balance
 *
 * Each check carries an i18n key as its `message`, so the UI just looks
 * up `error.issues[0].message`.
 */
export function buildAmountSchema(balance: number) {
  return z
    .string()
    .min(1, { message: "swap.error.required" })
    .regex(AMOUNT_PATTERN, { message: "swap.error.invalid" })
    .refine(
      (value) => (value.split(".")[1]?.length ?? 0) <= MAX_DECIMALS,
      { message: "swap.error.tooManyDecimals" },
    )
    .transform((value, ctx) => {
      const parsed = parseFloat(value);
      if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
        ctx.addIssue({ code: "custom", message: "swap.error.invalid" });
        return z.NEVER;
      }
      return parsed;
    })
    .pipe(
      z
        .number()
        .positive({ message: "swap.error.tooSmall" })
        .max(balance, { message: "swap.error.exceedsBalance" }),
    );
}

/**
 * Validate a sanitized amount against business rules. Returns `true` if
 * the value is acceptable, otherwise an i18n key for the error message.
 *
 * Backed by `buildAmountSchema` — the schema is the source of truth.
 */
export function validateAmount(
  value: string,
  balance: number,
): true | AmountErrorKey {
  const result = buildAmountSchema(balance).safeParse(value);
  if (result.success) return true;
  return result.error.issues[0].message as AmountErrorKey;
}
