import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useIntl } from "react-intl";
import { useSwapStore, setFromAmount } from "../store/useSwapStore";
import { sanitizeAmount, validateAmount } from "../utils/amountValidation";

export interface SwapFormValues {
  fromAmount: string;
}

export interface UseSwapFormResult {
  control: ReturnType<typeof useForm<SwapFormValues>>["control"];
  errorMessage: string | undefined;
  isValid: boolean;
  /** Sanitize then push the value into the form (and downstream into the store). */
  handleAmountChange: (raw: string, fieldOnChange: (v: string) => void) => void;
}

/**
 * react-hook-form wiring for the swap "from amount" input.
 *
 * - Initial value comes from the swap store (so navigating away/back keeps state).
 * - Validation runs on every change and against the current `fromToken.balance`.
 * - Error keys are translated through `react-intl` so messages live with the
 *   feature's intl JSON.
 * - Sanitized values flow back into the store so price/USD calculations
 *   continue to work off a single source of truth.
 */
export function useSwapForm(): UseSwapFormResult {
  const intl = useIntl();
  const fromToken = useSwapStore((s) => s.fromToken);

  // Snapshot the store value once, on mount, to seed the form. After that
  // the form is the source of truth for the input and pushes back to the store.
  const initial = useRef(useSwapStore.getState().fromAmount).current;

  const {
    control,
    formState: { errors, isValid },
    trigger,
    watch,
  } = useForm<SwapFormValues>({
    mode: "onChange",
    defaultValues: { fromAmount: initial },
  });

  const fromAmount = watch("fromAmount");

  // Sync valid form value to the store. We push every sanitized value
  // (even invalid ones, like an empty string) so derived UI stays consistent
  // with what the user sees.
  useEffect(() => {
    setFromAmount(fromAmount ?? "");
  }, [fromAmount]);

  // When the token changes, balance changes — re-run validation.
  useEffect(() => {
    void trigger("fromAmount");
  }, [fromToken.symbol, fromToken.balance, trigger]);

  function handleAmountChange(raw: string, fieldOnChange: (v: string) => void) {
    fieldOnChange(sanitizeAmount(raw));
  }

  const errorKey = errors.fromAmount?.message;
  const errorMessage = errorKey
    ? intl.formatMessage({ id: errorKey }, { symbol: fromToken.symbol })
    : undefined;

  return {
    control,
    errorMessage,
    isValid,
    handleAmountChange,
  };
}

/**
 * Validation rules object — exported so the `Controller` in SwapCardBody can
 * pass it directly. Returns the i18n key as the error message; the hook
 * translates it before exposing `errorMessage`.
 */
export function buildAmountRules(balance: number) {
  return {
    validate: (value: string) => {
      const result = validateAmount(value, balance);
      return result === true ? true : result;
    },
  };
}
