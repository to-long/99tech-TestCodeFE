import { useRef, useState, useLayoutEffect, useCallback, useEffect } from "react";
import {
  Repeat,
  Settings,
  ChevronDown,
  ArrowUpDown,
  ArrowRight,
  RefreshCw,
  Settings2,
  Globe,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { useIntl } from "react-intl";
import {
  useSwapStore,
  setFromAmount,
  swapTokens,
  openSelector,
  closeSelector,
  setFromToken,
  setToToken,
  getToAmount,
  getUsdValue,
  openSettings,
  fetchPrices,
} from "../store/useSwapStore";
import type { Token } from "../types/token";
import TokenSelector from "./TokenSelector";
import SettingsPanel, { NETWORKS } from "./SettingsPanel";

/** Format a number showing significant digits for very small values (e.g. 0.00000123) */
function formatAmount(n: number, minDecimals = 2): string {
  if (n === 0) return "0.00";
  const abs = Math.abs(n);
  if (abs >= 1) {
    return n.toLocaleString(undefined, { minimumFractionDigits: minDecimals, maximumFractionDigits: minDecimals });
  }
  // For small numbers, find first significant digit and show enough decimals
  if (abs < 0.01) {
    const digits = Math.max(minDecimals, -Math.floor(Math.log10(abs)) + 3);
    return n.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  }
  return n.toLocaleString(undefined, { minimumFractionDigits: minDecimals, maximumFractionDigits: minDecimals });
}

function TokenBadge({
  token,
  onClick,
}: {
  token: Token;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="flex cursor-pointer items-center gap-2.5">
      <img
        src={token.image}
        alt={token.symbol}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-['Funnel_Sans'] text-lg font-bold text-[var(--s-text)]">
          {token.symbol}
        </span>
        <span className="font-['Geist'] text-[11px] text-[var(--s-text-sub)]">
          {token.name}
        </span>
      </div>
      <ChevronDown size={16} className="text-[var(--s-text-sub)]" />
    </button>
  );
}

export default function SwapForm() {
  const intl = useIntl();
  const t = (id: string, values?: Record<string, string | number>) =>
    intl.formatMessage({ id }, values);

  const {
    fromToken, toToken, fromAmount, selectorOpen, settingsOpen,
    slippage, customSlippage, network, prices, fetching, refreshRate,
  } = useSwapStore();

  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [swapping, setSwapping] = useState(false);
  const [swapOffset, setSwapOffset] = useState({ from: 0, to: 0 });
  const [swapLoading, setSwapLoading] = useState(false);

  // Auto-fetch prices on interval
  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, refreshRate * 1000);
    return () => clearInterval(id);
  }, [refreshRate]);

  useLayoutEffect(() => {
    const el = settingsOpen ? backRef.current : frontRef.current;
    if (el) setHeight(el.offsetHeight);
  }, [settingsOpen]);

  const handleSwap = useCallback(() => {
    if (swapping) return;
    const fromEl = fromRef.current;
    const toEl = toRef.current;
    if (!fromEl || !toEl) { swapTokens(); return; }

    const gap = 16;
    const fromH = fromEl.offsetHeight;
    const toH = toEl.offsetHeight;

    setSwapOffset({ from: toH + gap, to: -(fromH + gap) });
    setSwapping(true);

    setTimeout(() => {
      setSwapping(false);
      setSwapOffset({ from: 0, to: 0 });
      swapTokens();
    }, 400);
  }, [swapping]);

  const toAmount = getToAmount(fromAmount, fromToken.symbol, toToken.symbol, prices);
  const fromUsd = getUsdValue(parseFloat(fromAmount) || 0, fromToken.symbol, prices);
  const toUsd = getUsdValue(toAmount, toToken.symbol, prices);
  const exchangeRate = (prices[fromToken.symbol] ?? 0) / (prices[toToken.symbol] ?? 1);
  const slippageDisplay = slippage === "custom" ? (customSlippage || "0") + "%" : slippage + "%";
  const selectedNetwork = NETWORKS.find((n) => n.id === network) ?? NETWORKS[0];

  return (
    <>
      <div className="w-[380px] [perspective:1200px]">
        <div
          className="relative transition-all duration-500 [transform-style:preserve-3d]"
          style={{
            transform: settingsOpen ? "rotateY(180deg)" : "rotateY(0deg)",
            height: height ?? "auto",
          }}
        >
          {/* Front — Swap Form */}
          <div ref={frontRef} className="absolute inset-x-0 top-0 rounded-2xl bg-[var(--s-card)] transition-colors duration-300 [backface-visibility:hidden]">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[var(--s-border-header)] px-5 pb-3 pt-[14px]">
              <div className="flex items-center gap-3">
                <Repeat size={24} className="text-[var(--s-btn)]" />
                <span className="font-['Funnel_Sans'] text-2xl font-extrabold text-[var(--s-text)]">
                  {t("swap.title")}
                </span>
              </div>
              <button
                onClick={openSettings}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--s-field)]"
              >
                <Settings size={20} className="text-[var(--s-text-sub)]" />
              </button>
            </div>

            <div className="relative flex flex-col gap-4 px-5 pb-5 pt-3">
              {/* From Section */}
              <div
                ref={fromRef}
                className="flex flex-col gap-3"
                style={{
                  transform: `translateY(${swapOffset.from}px)`,
                  transition: swapping ? "transform 400ms cubic-bezier(.4,0,.2,1)" : "none",
                  zIndex: swapping ? 2 : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] text-[13px] font-medium text-[var(--s-text-sub)]">
                    {t("swap.youPay")}
                  </span>
                  <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                    {t("swap.balance", { balance: fromToken.balance.toLocaleString(), symbol: fromToken.symbol })}
                  </span>
                </div>
                <div className="flex h-[72px] items-center justify-between rounded-xl border border-[var(--s-border)] bg-[var(--s-field)] px-4 transition-colors duration-300">
                  <TokenBadge
                    token={fromToken}
                    onClick={() => openSelector("from")}
                  />
                  <div className="flex flex-col items-end gap-0.5">
                    <input
                      type="text"
                      value={fromAmount}
                      onChange={(e) => setFromAmount(e.target.value)}
                      className="w-28 bg-transparent text-right font-['Funnel_Sans'] text-[28px] font-extrabold text-[var(--s-text)] outline-none"
                    />
                    <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                      ≈ ${formatAmount(fromUsd)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Swap Button — absolutely positioned */}
              <button
                onClick={handleSwap}
                className="absolute left-1/2 top-[97px] z-10 flex h-8 w-8 -translate-x-1/2 cursor-pointer items-center justify-center rounded-full bg-[var(--s-btn)] shadow-[0_4px_8px_#2D5E3A30] hover:bg-[var(--s-btn-hover)] hover:shadow-[0_4px_12px_#2D5E3A50]"
                style={{
                  transition: swapping ? "transform 400ms cubic-bezier(.4,0,.2,1)" : "none",
                  rotate: swapping ? "180deg" : "0deg",
                }}
              >
                <ArrowUpDown size={14} className="text-white" />
              </button>

              {/* To Section */}
              <div
                ref={toRef}
                className="flex flex-col gap-3"
                style={{
                  transform: `translateY(${swapOffset.to}px)`,
                  transition: swapping ? "transform 400ms cubic-bezier(.4,0,.2,1)" : "none",
                  zIndex: swapping ? 2 : undefined,
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] text-[13px] font-medium text-[var(--s-text-sub)]">
                    {t("swap.youReceive")}
                  </span>
                  <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                    {t("swap.balance", { balance: toToken.balance.toLocaleString(undefined, { minimumFractionDigits: 2 }), symbol: toToken.symbol })}
                  </span>
                </div>
                <div className="flex h-[72px] items-center justify-between rounded-xl border border-[var(--s-border)] bg-[var(--s-field)] px-4 transition-colors duration-300">
                  <TokenBadge
                    token={toToken}
                    onClick={() => openSelector("to")}
                  />
                  <div className="flex flex-col items-end gap-0.5">
                    <span className="font-['Funnel_Sans'] text-[28px] font-extrabold text-[var(--s-text)]">
                      {formatAmount(toAmount)}
                    </span>
                    <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                      ≈ ${formatAmount(toUsd)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rate Section */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] text-[11px] text-[var(--s-text-muted)]">
                    {t("swap.exchangeRate")}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-['Geist'] text-[11px] font-medium text-[var(--s-text-rate)]">
                      1 {fromToken.symbol} = {formatAmount(exchangeRate)}{" "}
                      {toToken.symbol}
                    </span>
                    <RefreshCw
                      size={10}
                      className={`text-[var(--s-text-muted)] ${fetching ? "animate-spin" : ""}`}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] text-[11px] text-[var(--s-text-muted)]">
                    {t("swap.maxSlippage")}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-['Geist'] text-[11px] font-medium text-[var(--s-text-rate)]">
                      {slippageDisplay}
                    </span>
                    <Settings2 size={10} className="text-[var(--s-text-muted)]" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Geist'] text-[11px] text-[var(--s-text-muted)]">
                    {t("swap.networkFee")}
                  </span>
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-3 w-3 items-center justify-center rounded-full border border-[var(--s-border-icon)]"
                      style={{ backgroundColor: selectedNetwork.color }}
                    >
                      <span className="text-[6px] font-bold text-white">{selectedNetwork.icon}</span>
                    </div>
                    <span className="font-['Geist'] text-[11px] font-medium text-[var(--s-text-rate)]">
                      {selectedNetwork.name}
                    </span>
                    <span className="font-['Geist'] text-[11px] text-[var(--s-text-muted)]">
                      {selectedNetwork.gas}
                    </span>
                    <Globe size={10} className="text-[var(--s-text-muted)]" />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  disabled={swapLoading}
                  onClick={() => {
                    if (swapLoading) return;
                    setSwapLoading(true);
                    setTimeout(() => setSwapLoading(false), 3000);
                  }}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[var(--s-btn)] px-4 py-2.5 shadow-[0_4px_12px_#2D5E3A25] transition-all duration-200 hover:bg-[var(--s-btn-hover)] hover:shadow-[0_6px_16px_#2D5E3A40] disabled:opacity-80"
                >
                  <span className="font-['Funnel_Sans'] text-[17px] font-bold text-white">
                    {swapLoading ? t("swap.swapping") : t("swap.button")}
                  </span>
                  {swapLoading ? (
                    <Loader2 size={18} className="animate-spin text-white" />
                  ) : (
                    <ArrowRight size={18} className="text-white" />
                  )}
                </button>
              </div>

              {/* Footer */}
              <div className="flex h-[22px] items-center justify-center gap-1.5 pt-1">
                <ShieldCheck size={10} className="text-[var(--s-shield)]" />
                <span className="font-['Geist'] text-[9px] text-[var(--s-text-sub)]">
                  {t("swap.footer")}
                </span>
              </div>
            </div>
          </div>

          {/* Back — Settings Panel */}
          <div ref={backRef} className="absolute inset-x-0 top-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <SettingsPanel />
          </div>

        </div>
      </div>

      {/* Token Selector — full-screen overlay with backdrop */}
      {selectorOpen && (
        <TokenSelector
          selectedSymbol={
            selectorOpen === "from" ? fromToken.symbol : toToken.symbol
          }
          onSelect={selectorOpen === "from" ? setFromToken : setToToken}
          onClose={closeSelector}
        />
      )}
    </>
  );
}
