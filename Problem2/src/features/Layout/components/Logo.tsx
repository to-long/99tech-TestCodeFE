import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useIntl } from "react-intl";

export default function Logo() {
  const intl = useIntl();

  // `min-w-0` on every flex ancestor lets the inner spans truncate
  // with `…` instead of wrapping when the header runs out of room.
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="relative h-7 w-7 shrink-0 rounded-full bg-gradient-to-br from-[#2D5E3A] to-[#4A9B5C]">
        <ArrowUpRight className="absolute left-1.5 top-1.5 text-white" size={10} />
        <ArrowDownLeft className="absolute left-[13px] top-[13px] text-white" size={10} />
      </div>
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate text-base font-bold text-[var(--s-text)]">
          {intl.formatMessage({ id: "brand.name" })}
        </span>
        <span className="truncate text-[10px] font-medium text-[var(--s-text-sub)]">
          {intl.formatMessage({ id: "brand.subtitle" })}
        </span>
      </div>
    </div>
  );
}
