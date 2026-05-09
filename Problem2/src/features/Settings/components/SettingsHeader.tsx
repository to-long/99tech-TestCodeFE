import { X } from "lucide-react";
import { closeSettings } from "../../SwapToken/store/useSwapStore";
import { useT } from "@shared/hooks/useT";

export default function SettingsHeader() {
  const t = useT();
  return (
    <div className="flex items-center justify-between border-b border-[var(--s-border-light)] px-5 pb-3 pt-[14px]">
      <span className="font-['Funnel_Sans'] text-lg font-bold text-[var(--s-text)]">
        {t("settings.title")}
      </span>
      <button
        onClick={closeSettings}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--s-field)]"
      >
        <X size={20} className="text-[var(--s-text-sub)]" />
      </button>
    </div>
  );
}
