import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePriceFetcher } from "./usePriceFetcher";
import { useSwapStore } from "../store/useSwapStore";

beforeEach(() => {
  vi.useFakeTimers();
  globalThis.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch;
  useSwapStore.setState({ refreshRate: 10 });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("usePriceFetcher", () => {
  it("fetches once on mount", () => {
    renderHook(() => usePriceFetcher());
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it("re-fetches every refreshRate seconds", () => {
    renderHook(() => usePriceFetcher());
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(10_000);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);

    vi.advanceTimersByTime(10_000);
    expect(globalThis.fetch).toHaveBeenCalledTimes(3);
  });

  it("clears the interval on unmount", () => {
    const { unmount } = renderHook(() => usePriceFetcher());
    unmount();
    vi.advanceTimersByTime(60_000);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });
});
