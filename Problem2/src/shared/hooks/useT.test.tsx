import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { IntlProvider } from "react-intl";
import type { ReactNode } from "react";
import { useT } from "./useT";

const messages = {
  greeting: "Hello, {name}!",
  plain: "Just a string",
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <IntlProvider locale="en" messages={messages} defaultLocale="en">
    {children}
  </IntlProvider>
);

describe("useT", () => {
  it("returns a translator that resolves message ids", () => {
    const { result } = renderHook(() => useT(), { wrapper });
    expect(result.current("plain")).toBe("Just a string");
  });

  it("interpolates ICU values", () => {
    const { result } = renderHook(() => useT(), { wrapper });
    expect(result.current("greeting", { name: "Long" })).toBe("Hello, Long!");
  });

  it("falls back to the message id when missing", () => {
    const { result } = renderHook(() => useT(), { wrapper });
    expect(result.current("missing.key")).toBe("missing.key");
  });
});
