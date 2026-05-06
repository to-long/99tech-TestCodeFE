import { useSwapStore, setSlippage, setCustomSlippage } from "../../SwapToken/store/useSwapStore";
import { useT } from "../../../shared/hooks/useT";
import { SLIPPAGE_PRESETS } from "../data/presets";
import SectionHeader from "./SectionHeader";

export default function SlippageSection() {
  const t = useT();
  const slippage = useSwapStore((s) => s.slippage);
  const customSlippage = useSwapStore((s) => s.customSlippage);

  return (
    <div className="flex flex-col gap-3">
      <SectionHeader label={t("settings.slippage")} tooltip={t("settings.slippageTip")} />
      <div className="flex gap-2">
        {SLIPPAGE_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => setSlippage(preset.value)}
            className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg font-['Inter'] text-sm font-medium transition-all duration-200 ${
              slippage === preset.value
                ? "bg-[var(--s-btn)] font-semibold text-white"
                : "bg-[var(--s-field)] text-[var(--s-text-sub)]"
            }`}
          >
            {preset.label}
          </button>
        ))}
        <button
          onClick={() => setSlippage("custom")}
          className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg font-['Inter'] text-[13px] transition-all duration-200 ${
            slippage === "custom"
              ? "bg-[var(--s-btn)] font-semibold text-white"
              : "bg-[var(--s-field)] text-[var(--s-text-dim)]"
          }`}
        >
          {slippage === "custom" && customSlippage
            ? `${customSlippage}%`
            : t("settings.custom")}
        </button>
      </div>
      {slippage === "custom" && (
        <div className="flex h-10 items-center gap-2 rounded-lg bg-[var(--s-field)] px-3.5">
          <input
            type="text"
            value={customSlippage}
            onChange={(e) => setCustomSlippage(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent font-['Inter'] text-sm text-[var(--s-text)] outline-none placeholder:text-[var(--s-text-dim)]"
          />
          <span className="font-['Inter'] text-sm text-[var(--s-text-dim)]">%</span>
        </div>
      )}
    </div>
  );
}
