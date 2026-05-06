import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useModalAnimation } from "./useModalAnimation";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useModalAnimation", () => {
  it("flips visible to true on the next animation frame", () => {
    const { result } = renderHook(() => useModalAnimation());
    expect(result.current.visible).toBe(false);

    act(() => {
      vi.runAllTimers();
    });

    expect(result.current.visible).toBe(true);
  });

  it("close() flips visible off and runs the callback after the exit delay", () => {
    const onDone = vi.fn();
    const { result } = renderHook(() => useModalAnimation());

    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.visible).toBe(true);

    act(() => result.current.close(onDone));
    expect(result.current.visible).toBe(false);
    expect(onDone).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
