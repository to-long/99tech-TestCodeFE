import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSwapAnimation } from "./useSwapAnimation";
import { useSwapStore } from "../store/useSwapStore";
import { TOKENS } from "../data/tokens";

function makeRef(height: number) {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetHeight", { value: height });
  return { current: el };
}

beforeEach(() => {
  vi.useFakeTimers();
  useSwapStore.setState({ fromToken: TOKENS[0], toToken: TOKENS[1] });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useSwapAnimation", () => {
  it("trigger() animates and then commits a token swap", () => {
    const fromRef = makeRef(72);
    const toRef = makeRef(72);
    const { result } = renderHook(() => useSwapAnimation(fromRef, toRef));

    expect(result.current.swapping).toBe(false);
    expect(result.current.offset).toEqual({ from: 0, to: 0 });

    act(() => result.current.trigger());

    expect(result.current.swapping).toBe(true);
    // 72 (height) + 16 (gap) = 88
    expect(result.current.offset).toEqual({ from: 88, to: -88 });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current.swapping).toBe(false);
    expect(result.current.offset).toEqual({ from: 0, to: 0 });
    // store is swapped
    expect(useSwapStore.getState().fromToken).toBe(TOKENS[1]);
    expect(useSwapStore.getState().toToken).toBe(TOKENS[0]);
  });

  it("ignores trigger() while a swap is already in flight", () => {
    const fromRef = makeRef(72);
    const toRef = makeRef(72);
    const { result } = renderHook(() => useSwapAnimation(fromRef, toRef));

    act(() => result.current.trigger());
    const offsetDuringSwap = result.current.offset;
    act(() => result.current.trigger());
    expect(result.current.offset).toEqual(offsetDuringSwap);
  });

  it("falls back to instant swap if refs are null", () => {
    const fromRef: { current: HTMLElement | null } = { current: null };
    const toRef: { current: HTMLElement | null } = { current: null };
    const { result } = renderHook(() => useSwapAnimation(fromRef, toRef));

    act(() => result.current.trigger());

    expect(result.current.swapping).toBe(false);
    expect(useSwapStore.getState().fromToken).toBe(TOKENS[1]);
    expect(useSwapStore.getState().toToken).toBe(TOKENS[0]);
  });
});
