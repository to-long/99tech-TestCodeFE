import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useClickOutside } from "./useClickOutside";

function fireMouseDownOn(target: EventTarget) {
  const event = new MouseEvent("mousedown", { bubbles: true });
  target.dispatchEvent(event);
}

describe("useClickOutside", () => {
  it("invokes handler when mousedown lands outside the ref", () => {
    const handler = vi.fn();
    const inside = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(inside, outside);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(inside);
      useClickOutside(ref, handler);
      return ref;
    });

    fireMouseDownOn(outside);
    expect(handler).toHaveBeenCalledTimes(1);

    fireMouseDownOn(inside);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("treats multiple refs as one combined boundary", () => {
    const handler = vi.fn();
    const a = document.createElement("div");
    const b = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(a, b, outside);

    renderHook(() => {
      const refA = useRef<HTMLDivElement>(a);
      const refB = useRef<HTMLDivElement>(b);
      useClickOutside([refA, refB], handler);
    });

    fireMouseDownOn(a);
    fireMouseDownOn(b);
    expect(handler).not.toHaveBeenCalled();

    fireMouseDownOn(outside);
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("does nothing when disabled", () => {
    const handler = vi.fn();
    const inside = document.createElement("div");
    const outside = document.createElement("div");
    document.body.append(inside, outside);

    renderHook(() => {
      const ref = useRef<HTMLDivElement>(inside);
      useClickOutside(ref, handler, false);
    });

    fireMouseDownOn(outside);
    expect(handler).not.toHaveBeenCalled();
  });
});
