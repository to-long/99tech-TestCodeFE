import { describe, it, expect, beforeEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useRef } from "react";
import { useTooltipPosition } from "./useTooltipPosition";

function makeTrigger({
  rect,
  cardRect,
}: {
  rect: Partial<DOMRect>;
  cardRect: Partial<DOMRect> | null;
}) {
  const card = cardRect ? document.createElement("div") : null;
  if (card && cardRect) {
    card.className = "w-[380px]";
    Object.defineProperty(card, "getBoundingClientRect", {
      value: () => cardRect,
    });
    document.body.appendChild(card);
  }
  const trigger = document.createElement("button");
  if (card) card.appendChild(trigger);
  else document.body.appendChild(trigger);
  Object.defineProperty(trigger, "getBoundingClientRect", {
    value: () => rect,
  });
  return trigger;
}

beforeEach(() => {
  document.body.innerHTML = "";
  Object.defineProperty(window, "innerWidth", { value: 1280, configurable: true });
});

describe("useTooltipPosition", () => {
  it("places tooltip to the right when there is room", () => {
    const trigger = makeTrigger({
      rect: { top: 100, bottom: 120, right: 500, height: 20 } as DOMRect,
      cardRect: { right: 600, left: 400 } as DOMRect,
    });

    const { result } = renderHook(() => {
      const ref = useRef(trigger);
      return useTooltipPosition(ref, true);
    });

    expect(result.current.side).toBe("right");
    expect(result.current.left).toBe(610); // 600 + 10 gap
    expect(result.current.top).toBe(110); // top + height/2
  });

  it("falls back to the left when right has no space", () => {
    Object.defineProperty(window, "innerWidth", { value: 700, configurable: true });
    const trigger = makeTrigger({
      rect: { top: 100, bottom: 120, right: 500, height: 20 } as DOMRect,
      cardRect: { right: 600, left: 400 } as DOMRect,
    });

    const { result } = renderHook(() => {
      const ref = useRef(trigger);
      return useTooltipPosition(ref, true);
    });

    expect(result.current.side).toBe("left");
    expect(result.current.left).toBe(400 - 10 - 208); // cardLeft - gap - tipWidth
  });

  it("falls back to the bottom on narrow viewports", () => {
    Object.defineProperty(window, "innerWidth", { value: 380, configurable: true });
    const trigger = makeTrigger({
      rect: { top: 100, bottom: 120, right: 350, height: 20 } as DOMRect,
      cardRect: { right: 380, left: 0 } as DOMRect,
    });

    const { result } = renderHook(() => {
      const ref = useRef(trigger);
      return useTooltipPosition(ref, true);
    });

    expect(result.current.side).toBe("bottom");
    expect(result.current.top).toBe(130); // bottom + gap
  });

  it("returns initial 0 position when disabled", () => {
    const trigger = makeTrigger({
      rect: { top: 100, bottom: 120, right: 500, height: 20 } as DOMRect,
      cardRect: { right: 600, left: 400 } as DOMRect,
    });

    const { result } = renderHook(() => {
      const ref = useRef(trigger);
      return useTooltipPosition(ref, false);
    });

    expect(result.current).toEqual({ top: 0, left: 0, side: "right" });
  });
});
