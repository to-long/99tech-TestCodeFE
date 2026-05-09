import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { Controller, useFormContext, FormProvider } from "react-hook-form";
import { useT as _useT } from "@shared/hooks/useT";
import { renderWithIntl } from "@test/renderWithIntl";
import { IntlProvider } from "react-intl";
import { messages } from "@/intl";
import type { ReactNode } from "react";
import { useSwapForm, buildAmountRules } from "./useSwapForm";
import { useSwapStore } from "../store/useSwapStore";
import { TOKENS } from "../data/tokens";

// Suppress unused warnings — these are imported only to ensure types resolve
void _useT;
void renderWithIntl;
void Controller;
void useFormContext;
void FormProvider;

const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en" messages={messages.en} defaultLocale="en">
    {children}
  </IntlProvider>
);

beforeEach(() => {
  // Reset store with a known fromToken (balance: 2.458) and clean amount.
  useSwapStore.setState({ fromToken: TOKENS[0], fromAmount: "1.5" });
});

describe("useSwapForm", () => {
  it("seeds the form with the store's initial fromAmount", () => {
    useSwapStore.setState({ fromAmount: "0.42" });
    const { result } = renderHook(() => useSwapForm(), { wrapper });
    expect(result.current.control._defaultValues.fromAmount).toBe("0.42");
  });

  it("starts valid when seeded with a positive amount within balance", async () => {
    const { result } = renderHook(() => useSwapForm(), { wrapper });
    // isValid resolves async after first validation pass
    await waitFor(() => expect(result.current.isValid).toBe(true));
  });

  it("handleAmountChange sanitizes input and pushes to the form", async () => {
    const seen: string[] = [];
    const { result } = renderHook(() => useSwapForm(), { wrapper });

    const fieldOnChange = (v: string) => seen.push(v);
    act(() => result.current.handleAmountChange("abc1.5xyz", fieldOnChange));

    expect(seen).toEqual(["1.5"]);
  });
});

describe("buildAmountRules", () => {
  it("returns 'true' for a valid amount", () => {
    const rules = buildAmountRules(10);
    expect(rules.validate("1.5")).toBe(true);
  });

  it("returns the i18n key when the amount fails validation", () => {
    const rules = buildAmountRules(10);
    expect(rules.validate("")).toBe("swap.error.required");
    expect(rules.validate("0")).toBe("swap.error.tooSmall");
    expect(rules.validate("9999")).toBe("swap.error.exceedsBalance");
  });
});
