import { useEffect } from "react";
import type { RefObject } from "react";

/**
 * Invoke `handler` when a `mousedown` lands outside every supplied ref.
 * Pass multiple refs (e.g. trigger + popover) to treat them as a single
 * "outside" boundary.
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null> | Array<RefObject<HTMLElement | null>>,
  handler: () => void,
  enabled = true,
): void {
  useEffect(() => {
    if (!enabled) return;
    const refList = Array.isArray(refs) ? refs : [refs];

    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      const insideAny = refList.some((r) => r.current?.contains(target));
      if (!insideAny) handler();
    }

    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [refs, handler, enabled]);
}
