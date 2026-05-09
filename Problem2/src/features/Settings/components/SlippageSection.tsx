import { useSwapStore, setSlippage, setCustomSlippage } from "../../SwapToken/store/useSwapStore";
import { useT } from "@shared/hooks/useT";
import { sanitizeAmount } from "../../SwapToken/utils/amountValidation";
import { SLIPPAGE_PRESETS } from "../data/presets";
import SectionHeader from "./SectionHeader";

const MAX_SLIPPAGE_DECIMALS = 2;
/** Cap at 100% so users can't accidentally type "9999%". */
const MAX_SLIPPAGE_PERCENT = 100;

function clampSlippage(value: string): string {
  if (!value) return value;
  const parsed = parseFloat(value);
  if (Number.isNaN(parsed)) return value;
  if (parsed > MAX_SLIPPAGE_PERCENT) return String(MAX_SLIPPAGE_PERCENT);
  return value;
}

export default function SlippageSection() {
  const t = useT();
  const slippage = useSwapStore((s) => s.slippage);
  const customSlippage = useSwapStore((s) => s.customSlippage);

  function handleCustomChange(raw: string) {
    const sanitized = sanitizeAmount(raw, MAX_SLIPPAGE_DECIMALS);
    setCustomSlippage(clampSlippage(sanitized));
  }

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
          // `min-w-0` lets the flex item shrink below its content width so
          // the inner `truncate` span can ellipsize long custom values
          // (e.g. "100.00%") instead of overflowing the button.
          className={`flex h-10 min-w-0 flex-1 cursor-pointer items-center justify-center rounded-lg px-2 font-['Inter'] text-[13px] transition-all duration-200 ${
            slippage === "custom"
              ? "bg-[var(--s-btn)] font-semibold text-white"
              : "bg-[var(--s-field)] text-[var(--s-text-dim)]"
          }`}
        >
          <span className="truncate">
            {slippage === "custom" && customSlippage
              ? `${customSlippage}%`
              : t("settings.custom")}
          </span>
        </button>
      </div>
      {slippage === "custom" && (
        <div className="flex h-10 items-center gap-2 rounded-lg bg-[var(--s-field)] px-3.5">
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            spellCheck={false}
            value={customSlippage}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder="0.00"
            className="flex-1 bg-transparent font-['Inter'] text-sm text-[var(--s-text)] outline-none placeholder:text-[var(--s-text-dim)]"
          />
          <span className="font-['Inter'] text-sm text-[var(--s-text-dim)]">%</span>
        </div>
      )}
    </div>
  );
}
