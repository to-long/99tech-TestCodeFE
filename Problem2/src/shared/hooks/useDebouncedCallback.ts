import { useRef, useEffect, useCallback } from "react";

/**
 * Returns a stable, debounced version of `callback`.
 *
 * The returned function delays invoking `callback` until `delay` ms have
 * elapsed since the last call. The timer is cleared on unmount.
 *
 * ```ts
 * const save = useDebouncedCallback((v: string) => store.set(v), 300);
 * <input onChange={e => save(e.target.value)} />
 * ```
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  const callbackRef = useRef(callback);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Always point at the latest callback without restarting timers.
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  // Clear any pending timer on unmount.
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return useCallback(
    (...args: Args) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay);
    },
    [delay],
  );
}
