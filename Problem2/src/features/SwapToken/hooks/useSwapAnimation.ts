import { useCallback, useState } from "react";
import type { RefObject } from "react";
import { swapTokens } from "../store/useSwapStore";

const SWAP_DURATION_MS = 400;
const GAP_PX = 16;

interface UseSwapAnimationResult {
  /** Translate offsets to apply to the from/to cards during the swap. */
  offset: { from: number; to: number };
  /** True while the swap animation is playing. */
  swapping: boolean;
  /** Trigger the swap animation; falls back to instant swap if refs are null. */
  trigger: () => void;
}

/**
 * Animate the from/to cards crossing each other vertically before
 * committing the swap to the store. Reads heights from the supplied refs
 * to compute the translation distance so it adapts to whatever content
 * is currently rendered.
 */
export function useSwapAnimation(
  fromRef: RefObject<HTMLElement | null>,
  toRef: RefObject<HTMLElement | null>,
): UseSwapAnimationResult {
  const [swapping, setSwapping] = useState(false);
  const [offset, setOffset] = useState({ from: 0, to: 0 });

  const trigger = useCallback(() => {
    if (swapping) return;
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!fromEl || !toEl) {
      swapTokens();
      return;
    }

    const fromH = fromEl.offsetHeight;
    const toH = toEl.offsetHeight;

    setOffset({ from: toH + GAP_PX, to: -(fromH + GAP_PX) });
    setSwapping(true);

    setTimeout(() => {
      setSwapping(false);
      setOffset({ from: 0, to: 0 });
      swapTokens();
    }, SWAP_DURATION_MS);
  }, [swapping, fromRef, toRef]);

  return { offset, swapping, trigger };
}
