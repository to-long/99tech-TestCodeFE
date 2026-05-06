import { useSwapStore, setRefreshRate } from "../../SwapToken/store/useSwapStore";
import { useT } from "../../../shared/hooks/useT";
import { REFRESH_RATES } from "../data/presets";
import SectionHeader from "./SectionHeader";

export default function RefreshRateSection() {
  const t = useT();
  const refreshRate = useSwapStore((s) => s.refreshRate);

  return (
    <div className="flex flex-col gap-2">
      <SectionHeader label={t("settings.refreshRate")} tooltip={t("settings.refreshRateTip")} />
      <div className="flex gap-2">
        {REFRESH_RATES.map((rate) => (
          <button
            key={rate.value}
            onClick={() => setRefreshRate(rate.value)}
            className={`flex h-9 flex-1 cursor-pointer items-center justify-center rounded-md font-['Inter'] text-[13px] font-medium transition-all duration-200 ${
              refreshRate === rate.value
                ? "bg-[var(--s-btn)] font-semibold text-white"
                : "bg-[var(--s-field)] text-[var(--s-text-sub)]"
            }`}
          >
            {rate.label}
          </button>
        ))}
      </div>
    </div>
  );
}
