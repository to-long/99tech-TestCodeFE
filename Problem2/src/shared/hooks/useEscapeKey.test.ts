import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useEscapeKey } from "./useEscapeKey";

function fireKey(key: string) {
  document.dispatchEvent(new KeyboardEvent("keydown", { key }));
}

describe("useEscapeKey", () => {
  it("invokes the handler on Escape", () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler));
    fireKey("Escape");
    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("ignores other keys", () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler));
    fireKey("Enter");
    fireKey("a");
    expect(handler).not.toHaveBeenCalled();
  });

  it("does nothing when disabled", () => {
    const handler = vi.fn();
    renderHook(() => useEscapeKey(handler, false));
    fireKey("Escape");
    expect(handler).not.toHaveBeenCalled();
  });

  it("removes the listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEscapeKey(handler));
    unmount();
    fireKey("Escape");
    expect(handler).not.toHaveBeenCalled();
  });
});
