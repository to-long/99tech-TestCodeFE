import { useCallback, useEffect, useState } from "react";
import type { RefObject } from "react";

const TIP_WIDTH = 208;
const GAP = 10;

type Side = "right" | "left" | "bottom";

export interface TooltipPosition {
  top: number;
  left: number;
  side: Side;
}

/**
 * Compute viewport-aware placement for the settings tooltip.
 *
 * Tries `right` of the surrounding 380px card first; falls back to `left`
 * if there's no room, then to `bottom` of the trigger for narrow viewports.
 * Recomputes whenever `enabled` flips on. Caller is responsible for setting
 * `enabled = false` when the tooltip is hidden.
 */
export function useTooltipPosition(
  triggerRef: RefObject<HTMLElement | null>,
  enabled: boolean,
): TooltipPosition {
  const [pos, setPos] = useState<TooltipPosition>({
    top: 0,
    left: 0,
    side: "right",
  });

  const update = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    // Find the surrounding swap card to keep the tooltip outside it.
    const card = triggerRef.current.closest(".w-\\[380px\\]");
    const cardRect = card?.getBoundingClientRect();
    const cardRight = cardRect?.right ?? rect.right;
    const cardLeft = cardRect?.left ?? rect.left;

    const spaceRight = window.innerWidth - cardRight - GAP;
    const spaceLeft = cardLeft - GAP;

    if (spaceRight >= TIP_WIDTH) {
      setPos({
        top: rect.top + rect.height / 2,
        left: cardRight + GAP,
        side: "right",
      });
    } else if (spaceLeft >= TIP_WIDTH) {
      setPos({
        top: rect.top + rect.height / 2,
        left: cardLeft - GAP - TIP_WIDTH,
        side: "left",
      });
    } else {
      setPos({
        top: rect.bottom + GAP,
        left: Math.max(GAP, rect.right - TIP_WIDTH),
        side: "bottom",
      });
    }
  }, [triggerRef]);

  useEffect(() => {
    if (enabled) update();
  }, [enabled, update]);

  return pos;
}
