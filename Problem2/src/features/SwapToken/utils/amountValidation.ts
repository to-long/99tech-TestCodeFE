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
 */
export function sanitizeAmount(input: string): string {
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
    if (decimals.length > MAX_DECIMALS) {
      cleaned = `${whole}.${decimals.slice(0, MAX_DECIMALS)}`;
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

/**
 * Build a `zod` schema for the swap "from amount" against a given balance.
 * The schema validates a string and surfaces i18n keys as error messages,
 * with the first failing rule taking precedence (`superRefine` early-exits).
 */
export function buildAmountSchema(balance: number) {
  return z.string().superRefine((value, ctx) => {
    if (!value) {
      ctx.addIssue({ code: "custom", message: "swap.error.required" });
      return;
    }

    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || !Number.isFinite(parsed)) {
      ctx.addIssue({ code: "custom", message: "swap.error.invalid" });
      return;
    }

    if (parsed <= 0) {
      ctx.addIssue({ code: "custom", message: "swap.error.tooSmall" });
      return;
    }

    const decimals = value.includes(".") ? value.split(".")[1].length : 0;
    if (decimals > MAX_DECIMALS) {
      ctx.addIssue({
        code: "custom",
        message: "swap.error.tooManyDecimals",
      });
      return;
    }

    if (parsed > balance) {
      ctx.addIssue({
        code: "custom",
        message: "swap.error.exceedsBalance",
      });
      return;
    }
  });
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
