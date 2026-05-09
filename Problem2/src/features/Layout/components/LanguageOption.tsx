import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import type { LanguageOption as LanguageOptionData } from "../data/languages";

interface Props {
  lang: LanguageOptionData;
  isSelected: boolean;
  onSelect: () => void;
  style?: CSSProperties;
}

export default function LanguageOption({ lang, isSelected, onSelect, style }: Props) {
  return (
    <button
      onClick={onSelect}
      style={style}
      className={`flex h-10 items-center gap-3 rounded-[8px] px-3 transition-colors duration-150 ${
        isSelected ? "bg-[var(--s-green-bg)]" : "hover:bg-muted"
      }`}
    >
      <span className="text-lg leading-none">{lang.flag}</span>
      <div className="flex flex-1 flex-col items-start gap-px">
        <span
          className={`text-sm font-medium ${
            isSelected ? "text-[var(--s-text)]" : "text-[var(--s-text-label)]"
          }`}
        >
          {lang.label}
        </span>
        <span
          className={`text-[11px] ${
            isSelected ? "text-[var(--s-text-label-sub)]" : "text-[var(--s-text-label-muted)]"
          }`}
        >
          {lang.code}
        </span>
      </div>
      {isSelected && <Check size={16} className="text-[var(--s-btn)]" />}
    </button>
  );
}
