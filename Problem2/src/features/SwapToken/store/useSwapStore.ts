import { createStore } from "../../../shared/lib/zustand/createStore";
import type { Token } from "../types/token";
import { TOKENS, MOCK_PRICES } from "../data/tokens";

type SlippagePreset = 0.1 | 0.5 | 1.0;
type RefreshRate = 5 | 10 | 30 | 60;

interface SwapState {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  selectorOpen: null | "from" | "to";
  settingsOpen: boolean;
  slippage: SlippagePreset | "custom";
  customSlippage: string;
  deadline: number;
  network: string;
  refreshRate: RefreshRate;
  apiEndpoint: string;
  expertMode: boolean;
  multihopTrades: boolean;
  prices: Record<string, number>;
  fetching: boolean;
}

const ACTIONS = {
  setFromToken: "swap/fromToken:set",
  setToToken: "swap/toToken:set",
  setFromAmount: "swap/fromAmount:set",
  swapTokens: "swap/tokens:swap",
  openSelector: "swap/selector:open",
  closeSelector: "swap/selector:close",
  openSettings: "swap/settings:open",
  closeSettings: "swap/settings:close",
  setSlippage: "swap/slippage:set",
  setCustomSlippage: "swap/customSlippage:set",
  setDeadline: "swap/deadline:set",
  setNetwork: "swap/network:set",
  setRefreshRate: "swap/refreshRate:set",
  setApiEndpoint: "swap/apiEndpoint:set",
  setExpertMode: "swap/expertMode:set",
  setMultihopTrades: "swap/multihopTrades:set",
  setPrices: "swap/prices:set",
  setFetching: "swap/fetching:set",
} as const;

export const useSwapStore = createStore<SwapState>(
  () => ({
    fromToken: TOKENS[0],
    toToken: TOKENS[1],
    fromAmount: "1.5",
    selectorOpen: null,
    settingsOpen: false,
    slippage: 0.5,
    customSlippage: "",
    deadline: 30,
    network: "ethereum",
    refreshRate: 10,
    apiEndpoint: "https://interview.switcheo.com/prices.json",
    expertMode: false,
    multihopTrades: true,
    prices: MOCK_PRICES,
    fetching: false,
  }),
  "SwapStore",
);

export function setFromToken(token: Token): void {
  const state = useSwapStore.getState();
  if (token.symbol === state.toToken.symbol) {
    useSwapStore.setState(
      { fromToken: token, toToken: state.fromToken, selectorOpen: null },
      false,
      ACTIONS.swapTokens,
    );
  } else {
    useSwapStore.setState(
      { fromToken: token, selectorOpen: null },
      false,
      ACTIONS.setFromToken,
    );
  }
}

export function setToToken(token: Token): void {
  const state = useSwapStore.getState();
  if (token.symbol === state.fromToken.symbol) {
    useSwapStore.setState(
      { toToken: token, fromToken: state.toToken, selectorOpen: null },
      false,
      ACTIONS.swapTokens,
    );
  } else {
    useSwapStore.setState(
      { toToken: token, selectorOpen: null },
      false,
      ACTIONS.setToToken,
    );
  }
}

export function setFromAmount(amount: string): void {
  useSwapStore.setState({ fromAmount: amount }, false, ACTIONS.setFromAmount);
}

export function swapTokens(): void {
  const { fromToken, toToken } = useSwapStore.getState();
  useSwapStore.setState(
    { fromToken: toToken, toToken: fromToken },
    false,
    ACTIONS.swapTokens,
  );
}

export function openSelector(side: "from" | "to"): void {
  useSwapStore.setState({ selectorOpen: side }, false, ACTIONS.openSelector);
}

export function closeSelector(): void {
  useSwapStore.setState({ selectorOpen: null }, false, ACTIONS.closeSelector);
}

export function getToAmount(
  fromAmount: string,
  fromSymbol: string,
  toSymbol: string,
  prices: Record<string, number>,
): number {
  const amt = parseFloat(fromAmount) || 0;
  const fromPrice = prices[fromSymbol] ?? 0;
  const toPrice = prices[toSymbol] ?? 1;
  return (amt * fromPrice) / toPrice;
}

export function getUsdValue(
  amount: number,
  symbol: string,
  prices: Record<string, number>,
): number {
  return amount * (prices[symbol] ?? 0);
}

export function openSettings(): void {
  useSwapStore.setState({ settingsOpen: true }, false, ACTIONS.openSettings);
}

export function closeSettings(): void {
  useSwapStore.setState({ settingsOpen: false }, false, ACTIONS.closeSettings);
}

export function setSlippage(value: SlippagePreset | "custom"): void {
  useSwapStore.setState({ slippage: value }, false, ACTIONS.setSlippage);
}

export function setCustomSlippage(value: string): void {
  useSwapStore.setState({ customSlippage: value, slippage: "custom" }, false, ACTIONS.setCustomSlippage);
}

export function setDeadline(value: number): void {
  useSwapStore.setState({ deadline: value }, false, ACTIONS.setDeadline);
}

export function setNetwork(value: string): void {
  useSwapStore.setState({ network: value }, false, ACTIONS.setNetwork);
}

export function setRefreshRate(value: RefreshRate): void {
  useSwapStore.setState({ refreshRate: value }, false, ACTIONS.setRefreshRate);
}

export function setApiEndpoint(value: string): void {
  useSwapStore.setState({ apiEndpoint: value }, false, ACTIONS.setApiEndpoint);
}

export function setExpertMode(value: boolean): void {
  useSwapStore.setState({ expertMode: value }, false, ACTIONS.setExpertMode);
}

export function setMultihopTrades(value: boolean): void {
  useSwapStore.setState({ multihopTrades: value }, false, ACTIONS.setMultihopTrades);
}

// ── Price fetching ──

let fetchingTimer: ReturnType<typeof setTimeout> | null = null;

export async function fetchPrices(): Promise<void> {
  useSwapStore.setState({ fetching: true }, false, ACTIONS.setFetching);

  if (fetchingTimer) clearTimeout(fetchingTimer);
  fetchingTimer = setTimeout(() => {
    useSwapStore.setState({ fetching: false }, false, ACTIONS.setFetching);
    fetchingTimer = null;
  }, 2000);

  try {
    const { apiEndpoint } = useSwapStore.getState();
    const res = await fetch(apiEndpoint);
    const data: Array<{ currency: string; date: string; price: number }> =
      await res.json();

    // Deduplicate: keep latest price per currency
    const latest: Record<string, { price: number; date: string }> = {};
    for (const entry of data) {
      if (!entry.currency || typeof entry.price !== "number") continue;
      const existing = latest[entry.currency];
      if (!existing || entry.date > existing.date) {
        latest[entry.currency] = { price: entry.price, date: entry.date };
      }
    }

    const prices: Record<string, number> = {};
    for (const [currency, { price }] of Object.entries(latest)) {
      prices[currency] = price;
    }

    useSwapStore.setState({ prices }, false, ACTIONS.setPrices);
  } catch (e) {
    console.error("Failed to fetch prices:", e);
  }
}
