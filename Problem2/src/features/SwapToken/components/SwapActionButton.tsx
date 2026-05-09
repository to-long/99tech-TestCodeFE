import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import { useT } from "@shared/hooks/useT";

const PENDING_MS = 3000;

interface Props {
  /** Externally disabled — e.g. when the form has validation errors. */
  disabled?: boolean;
}

export default function SwapActionButton({ disabled = false }: Props) {
  const t = useT();
  const [loading, setLoading] = useState(false);

  function handleClick() {
    if (loading || disabled) return;
    setLoading(true);
    setTimeout(() => setLoading(false), PENDING_MS);
  }

  const isDisabled = loading || disabled;

  return (
    <div className="pt-2">
      <button
        disabled={isDisabled}
        onClick={handleClick}
        className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[var(--s-btn)] px-4 py-2.5 shadow-[0_4px_12px_#2D5E3A25] transition-all duration-200 enabled:cursor-pointer enabled:hover:bg-[var(--s-btn-hover)] enabled:hover:shadow-[0_6px_16px_#2D5E3A40] disabled:cursor-not-allowed disabled:opacity-50"
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
