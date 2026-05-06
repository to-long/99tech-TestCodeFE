import {
  useSwapStore,
  closeSelector,
  setFromToken,
  setToToken,
} from "../store/useSwapStore";
import TokenSelector from "../../SelectToken/components/TokenSelector";

/**
 * Bridges the swap store's `selectorOpen` flag to the generic `TokenSelector`
 * modal. Renders nothing when no selector is active.
 */
export default function SwapTokenSelectorOverlay() {
  const { selectorOpen, fromToken, toToken } = useSwapStore();
  if (!selectorOpen) return null;

  const isFrom = selectorOpen === "from";
  return (
    <TokenSelector
      selectedSymbol={isFrom ? fromToken.symbol : toToken.symbol}
      onSelect={isFrom ? setFromToken : setToToken}
      onClose={closeSelector}
    />
  );
}
