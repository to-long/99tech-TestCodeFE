import { describe, expect, it, beforeEach, vi, afterEach } from "vitest";
import {
  useSwapStore,
  setFromToken,
  setToToken,
  setFromAmount,
  swapTokens,
  openSelector,
  closeSelector,
  openSettings,
  closeSettings,
  setSlippage,
  setCustomSlippage,
  setNetwork,
  setRefreshRate,
  getToAmount,
  getUsdValue,
  fetchPrices,
} from "./useSwapStore";
import { TOKENS, MOCK_PRICES } from "../data/tokens";

const initial = {
  fromToken: TOKENS[0],
  toToken: TOKENS[1],
  fromAmount: "1.5",
  selectorOpen: null,
  settingsOpen: false,
  slippage: 0.5 as const,
  customSlippage: "",
  network: "ethereum",
  refreshRate: 5 as const,
  apiEndpoint: "https://interview.switcheo.com/prices.json",
  prices: MOCK_PRICES,
  fetching: false,
};

beforeEach(() => {
  useSwapStore.setState(initial, true);
});

describe("useSwapStore — swap actions", () => {
  it("setFromAmount updates fromAmount", () => {
    setFromAmount("3.14");
    expect(useSwapStore.getState().fromAmount).toBe("3.14");
  });

  it("swapTokens swaps from and to", () => {
    swapTokens();
    const s = useSwapStore.getState();
    expect(s.fromToken).toBe(TOKENS[1]);
    expect(s.toToken).toBe(TOKENS[0]);
  });

  it("setFromToken with the current toToken triggers a swap", () => {
    setFromToken(TOKENS[1]); // currently "toToken"
    const s = useSwapStore.getState();
    expect(s.fromToken).toBe(TOKENS[1]);
    expect(s.toToken).toBe(TOKENS[0]);
    expect(s.selectorOpen).toBeNull();
  });

  it("setFromToken with a fresh token replaces fromToken only", () => {
    setFromToken(TOKENS[2]);
    const s = useSwapStore.getState();
    expect(s.fromToken).toBe(TOKENS[2]);
    expect(s.toToken).toBe(TOKENS[1]);
    expect(s.selectorOpen).toBeNull();
  });

  it("setToToken with the current fromToken triggers a swap", () => {
    setToToken(TOKENS[0]); // currently "fromToken"
    const s = useSwapStore.getState();
    expect(s.fromToken).toBe(TOKENS[1]);
    expect(s.toToken).toBe(TOKENS[0]);
  });

  it("setToToken with a fresh token replaces toToken only", () => {
    setToToken(TOKENS[3]);
    const s = useSwapStore.getState();
    expect(s.fromToken).toBe(TOKENS[0]);
    expect(s.toToken).toBe(TOKENS[3]);
  });
});

describe("useSwapStore — selector / settings UI flags", () => {
  it("openSelector / closeSelector toggle the open state", () => {
    openSelector("from");
    expect(useSwapStore.getState().selectorOpen).toBe("from");
    openSelector("to");
    expect(useSwapStore.getState().selectorOpen).toBe("to");
    closeSelector();
    expect(useSwapStore.getState().selectorOpen).toBeNull();
  });

  it("openSettings / closeSettings toggle settingsOpen", () => {
    openSettings();
    expect(useSwapStore.getState().settingsOpen).toBe(true);
    closeSettings();
    expect(useSwapStore.getState().settingsOpen).toBe(false);
  });
});

describe("useSwapStore — settings setters", () => {
  it("setSlippage replaces the slippage value", () => {
    setSlippage(0.1);
    expect(useSwapStore.getState().slippage).toBe(0.1);
    setSlippage("custom");
    expect(useSwapStore.getState().slippage).toBe("custom");
  });

  it("setCustomSlippage flips slippage to 'custom' and stores the value", () => {
    setSlippage(0.5);
    setCustomSlippage("2.5");
    expect(useSwapStore.getState().customSlippage).toBe("2.5");
    expect(useSwapStore.getState().slippage).toBe("custom");
  });

  it("setNetwork / setRefreshRate update the store", () => {
    setNetwork("polygon");
    setRefreshRate(60);

    const s = useSwapStore.getState();
    expect(s.network).toBe("polygon");
    expect(s.refreshRate).toBe(60);
  });
});

describe("getToAmount / getUsdValue", () => {
  const prices = { ETH: 2000, USDC: 1, USDT: 1 };

  it("getToAmount converts via the from/to price ratio", () => {
    expect(getToAmount("1", "ETH", "USDC", prices)).toBe(2000);
    expect(getToAmount("0.5", "ETH", "USDC", prices)).toBe(1000);
  });

  it("getToAmount handles invalid amount strings as 0", () => {
    expect(getToAmount("", "ETH", "USDC", prices)).toBe(0);
    expect(getToAmount("abc", "ETH", "USDC", prices)).toBe(0);
  });

  it("getToAmount falls back to 0/1 when a price is missing", () => {
    expect(getToAmount("1", "UNKNOWN", "USDC", prices)).toBe(0);
    expect(getToAmount("1", "ETH", "UNKNOWN", prices)).toBe(2000);
  });

  it("getUsdValue multiplies amount by the symbol's price", () => {
    expect(getUsdValue(2, "ETH", prices)).toBe(4000);
    expect(getUsdValue(2, "MISSING", prices)).toBe(0);
  });
});

describe("fetchPrices", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.useRealTimers();
  });

  it("dedupes by currency keeping the latest date and writes to store.prices", async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => [
        { currency: "ETH", date: "2024-01-01", price: 1500 },
        { currency: "ETH", date: "2024-02-01", price: 2500 },
        { currency: "USDC", date: "2024-01-01", price: 1 },
        { currency: "BAD", date: "2024-01-01", price: "string" }, // ignored
        { currency: "", date: "2024-01-01", price: 5 }, // ignored
      ],
    }) as unknown as typeof fetch;

    await fetchPrices();

    const { prices } = useSwapStore.getState();
    expect(prices.ETH).toBe(2500);
    expect(prices.USDC).toBe(1);
    expect(prices.BAD).toBeUndefined();
  });

  it("flips fetching: true immediately and back to false after the timer", async () => {
    vi.useFakeTimers();
    globalThis.fetch = vi.fn().mockResolvedValue({ json: async () => [] }) as unknown as typeof fetch;

    const promise = fetchPrices();
    expect(useSwapStore.getState().fetching).toBe(true);

    await promise;
    vi.advanceTimersByTime(2100);
    expect(useSwapStore.getState().fetching).toBe(false);
  });

  it("survives fetch failures without throwing", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("nope")) as unknown as typeof fetch;
    const errSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    await expect(fetchPrices()).resolves.toBeUndefined();
    errSpy.mockRestore();
  });
});
