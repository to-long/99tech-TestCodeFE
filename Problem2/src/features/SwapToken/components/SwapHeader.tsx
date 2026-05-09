import { Repeat, Settings } from "lucide-react";
import { openSettings } from "../store/useSwapStore";
import { useT } from "@shared/hooks/useT";

export default function SwapHeader() {
  const t = useT();
  return (
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
  );
}
