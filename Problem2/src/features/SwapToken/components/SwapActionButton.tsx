import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useT } from "../../../shared/hooks/useT";

const PENDING_MS = 3000;

export default function SwapActionButton() {
  const t = useT();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (loading) return;
    setLoading(true);
    setTimeout(() => setLoading(false), PENDING_MS);
  }

  return (
    <div className="pt-2">
      <button
        disabled={loading}
        onClick={handleClick}
        className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-[10px] bg-[var(--s-btn)] px-4 py-2.5 shadow-[0_4px_12px_#2D5E3A25] transition-all duration-200 hover:bg-[var(--s-btn-hover)] hover:shadow-[0_6px_16px_#2D5E3A40] disabled:opacity-80"
      >
        <span className="font-['Funnel_Sans'] text-[17px] font-bold text-white">
          {loading ? t("swap.swapping") : t("swap.button")}
        </span>
        {loading ? (
          <Loader2 size={18} className="animate-spin text-white" />
        ) : (
          <ArrowRight size={18} className="text-white" />
        )}
      </button>
    </div>
  );
}
