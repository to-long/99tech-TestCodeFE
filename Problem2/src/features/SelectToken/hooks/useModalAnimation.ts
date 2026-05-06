import { useEffect, useState, useCallback } from "react";

const EXIT_MS = 250;

interface UseModalAnimationResult {
  /** Whether the modal is currently rendered in its visible state. */
  visible: boolean;
  /** Trigger a graceful close: animates out, then runs `onDone` after the exit. */
  close: (onDone: () => void) => void;
}

/**
 * Drives a fade/scale enter+exit animation for a modal.
 * Sets `visible` to `true` on mount (after one rAF so the initial paint
 * is the hidden state), and exposes a `close` helper that flips `visible`
 * off and waits for the exit transition before invoking the parent callback.
 */
export function useModalAnimation(): UseModalAnimationResult {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const close = useCallback((onDone: () => void) => {
    setVisible(false);
    setTimeout(onDone, EXIT_MS);
  }, []);

  return { visible, close };
}
