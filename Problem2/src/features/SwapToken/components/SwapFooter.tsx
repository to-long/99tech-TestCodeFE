import { ShieldCheck } from "lucide-react";
import { useT } from "@shared/hooks/useT";

export default function SwapFooter() {
  const t = useT();
  return (
    <div className="flex h-[22px] items-center justify-center gap-1.5 pt-1">
      <ShieldCheck size={10} className="text-[var(--s-shield)]" />
      <span className="font-['Geist'] text-[9px] text-[var(--s-text-sub)]">
        {t("swap.footer")}
      </span>
    </div>
  );
}
