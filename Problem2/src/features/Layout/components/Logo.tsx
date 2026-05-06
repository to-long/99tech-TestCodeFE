import { ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useIntl } from "react-intl";

export default function Logo() {
  const intl = useIntl();

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative h-7 w-7 rounded-full bg-gradient-to-br from-[#2D5E3A] to-[#4A9B5C]">
        <ArrowUpRight className="absolute left-1.5 top-1.5 text-white" size={10} />
        <ArrowDownLeft className="absolute left-[13px] top-[13px] text-white" size={10} />
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-base font-bold text-[var(--s-text)]">
          {intl.formatMessage({ id: "brand.name" })}
        </span>
        <span className="text-[10px] font-medium text-[var(--s-text-sub)]">
          {intl.formatMessage({ id: "brand.subtitle" })}
        </span>
      </div>
    </div>
  );
}
