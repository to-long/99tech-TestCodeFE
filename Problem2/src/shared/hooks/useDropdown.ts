import { useState, useRef, useCallback } from "react";
import type { CSSProperties, RefObject } from "react";
import { useClickOutside } from "./useClickOutside";

const SPRING = "cubic-bezier(0.32,0.72,0,1)";
const OPEN_MS = 280;
const CLOSE_MS = 200;
const ITEM_STAGGER_MS = 50;

interface UseDropdownReturn {
  /** Whether the dropdown is logically open (items are interactive). */
  open: boolean;
  /** Whether the dropdown DOM should be mounted (includes closing animation). */
  mounted: boolean;
  /** Attach to the outermost wrapper `<div>`. */
  wrapperRef: RefObject<HTMLDivElement | null>;
  /** Toggle open / closed. */
  toggle: () => void;
  /** Close the dropdown (e.g. after selecting an item). */
  close: () => void;
  /** Attach to the dropdown panel's `onAnimationEnd`. */
  handleAnimationEnd: () => void;
  /** Inline style for the ChevronDown icon. */
  chevronStyle: CSSProperties;
  /** Inline style for the dropdown panel container. */
  panelStyle: CSSProperties;
  /** Returns inline style for the i-th dropdown item (staggered entrance). */
  itemStyle: (index: number) => CSSProperties;
}

/**
 * Headless hook that manages animated dropdown state.
 *
 * Provides styles for a spring-curve open/close animation with staggered
 * item entrances. Uses CSS `@keyframes` defined in `index.css`:
 * `dropdown-in`, `dropdown-out`, `item-in`.
 */
export function useDropdown(): UseDropdownReturn {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useClickOutside(wrapperRef, () => setOpen(false), open);

  const toggle = useCallback(() => {
    if (!open) {
      setMounted(true);
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [open]);

  const close = useCallback(() => setOpen(false), []);

  const handleAnimationEnd = useCallback(() => {
    // Unmount only after the *close* animation finishes.
    if (!open) setMounted(false);
  }, [open]);

  const chevronStyle: CSSProperties = {
    transition: `transform ${OPEN_MS}ms ${SPRING}`,
    transform: open ? "rotate(180deg)" : "rotate(0)",
  };

  const panelStyle: CSSProperties = {
    animation: open
      ? `dropdown-in ${OPEN_MS}ms ${SPRING} both`
      : `dropdown-out ${CLOSE_MS}ms ${SPRING} both`,
    pointerEvents: open ? "auto" : "none",
  };

  const itemStyle = useCallback(
    (index: number): CSSProperties =>
      open
        ? {
            animation: `item-in ${OPEN_MS}ms ${SPRING} ${index * ITEM_STAGGER_MS}ms both`,
          }
        : { opacity: 0 },
    [open],
  );

  return {
    open,
    mounted,
    wrapperRef,
    toggle,
    close,
    handleAnimationEnd,
    chevronStyle,
    panelStyle,
    itemStyle,
  };
}
