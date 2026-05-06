import { useEffect } from "react";
import { useSwapStore, fetchPrices } from "../store/useSwapStore";

/**
 * Kick off an immediate price fetch on mount, then re-fetch on the
 * configured `refreshRate` interval. Cleans up on unmount and on rate change.
 */
export function usePriceFetcher(): void {
  const refreshRate = useSwapStore((s) => s.refreshRate);
  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, refreshRate * 1000);
    return () => clearInterval(id);
  }, [refreshRate]);
}
