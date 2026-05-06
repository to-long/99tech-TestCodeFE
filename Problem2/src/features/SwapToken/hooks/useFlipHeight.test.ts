import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { useFlipHeight } from "./useFlipHeight";

function makeRef(height: number) {
  const el = document.createElement("div");
  Object.defineProperty(el, "offsetHeight", { value: height });
  return { current: el };
}

describe("useFlipHeight", () => {
  it("returns the front face's height when not flipped", () => {
    const front = makeRef(120);
    const back = makeRef(200);
    const { result } = renderHook(({ flipped }) => useFlipHeight(front, back, flipped), {
      initialProps: { flipped: false },
    });
    expect(result.current).toBe(120);
  });

  it("returns the back face's height when flipped", () => {
    const front = makeRef(120);
    const back = makeRef(200);
    const { result } = renderHook(({ flipped }) => useFlipHeight(front, back, flipped), {
      initialProps: { flipped: true },
    });
    expect(result.current).toBe(200);
  });

  it("updates when flipped changes", () => {
    const front = makeRef(120);
    const back = makeRef(200);
    const { result, rerender } = renderHook(
      ({ flipped }) => useFlipHeight(front, back, flipped),
      { initialProps: { flipped: false } },
    );
    expect(result.current).toBe(120);
    rerender({ flipped: true });
    expect(result.current).toBe(200);
  });
});
