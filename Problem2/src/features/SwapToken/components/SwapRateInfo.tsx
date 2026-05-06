import { RefreshCw, Settings2, Globe } from "lucide-react";
import { useSwapStore } from "../store/useSwapStore";
import { useT } from "../../../shared/hooks/useT";
import { formatAmount } from "../../../shared/utils/formatNumber";
import { getNetwork } from "../../Settings/data/networks";

export default function SwapRateInfo() {
  const t = useT();
  const {
    fromToken,
    toToken,
    prices,
    fetching,
    slippage,
    customSlippage,
    network,
  } = useSwapStore();

  const exchangeRate = (prices[fromToken.symbol] ?? 0) / (prices[toToken.symbol] ?? 1);
  const slippageDisplay =
    slippage === "custom" ? (customSlippage || "0") + "%" : slippage + "%";
  const selectedNetwork = getNetwork(network);

  return (
    <div className="flex flex-col gap-2">
      {/* Exchange Rate */}
      <div className="flex items-center justify-between">
        <span className="font-['Geist'] text-[11px] text-[var(--s-text-muted)]">
          {t("swap.exchangeRate")}
        </span>
        <div className="flex items-center gap-1">
          <span className="font-['Geist'] text-[11px] font-medium text-[var(--s-text-rate)]">
            1 {fromToken.symbol} = {formatAmount(exchangeRate)} {toToken.symbol}
          </span>
          <RefreshCw
            size={10}
            className={`text-[var(--s-text-muted)] ${fetching ? "animate-spin" : ""}`}
          />
        </div>
      </div>

      {/* Slippage */}
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

      {/* Network Fee */}
      <div className="flex items-center justify-between">
        <span className="font-['Geist'] text-[11px] text-[var(--s-text-muted)]">
          {t("swap.networkFee")}
        </span>
        <div className="flex items-center gap-2">
          <div
            className="flex h-3 w-3 items-center justify-center rounded-full border border-[var(--s-border-icon)]"
            style={{ backgroundColor: selectedNetwork.color }}
          >
            <span className="text-[6px] font-bold text-white">
              {selectedNetwork.icon}
            </span>
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
  );
}
