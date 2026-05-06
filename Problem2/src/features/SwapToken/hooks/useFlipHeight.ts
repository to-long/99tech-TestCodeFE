import { useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

/**
 * Track the height of whichever face is currently showing on a 3D-flipped
 * card. Returns the active face's `offsetHeight` so the wrapper can size
 * itself fluidly when content swaps.
 */
export function useFlipHeight(
  frontRef: RefObject<HTMLElement | null>,
  backRef: RefObject<HTMLElement | null>,
  flipped: boolean,
): number | undefined {
  const [height, setHeight] = useState<number | undefined>(undefined);

  useLayoutEffect(() => {
    const el = flipped ? backRef.current : frontRef.current;
    if (el) setHeight(el.offsetHeight);
  }, [flipped, frontRef, backRef]);

  return height;
}
