import { Globe, ChevronDown } from "lucide-react";
import { useGlobalStore, setLanguage } from "../store/useGlobalStore";
import { LANGUAGES } from "../data/languages";
import { useDropdown } from "@shared/hooks/useDropdown";
import LanguageOption from "./LanguageOption";

export default function LanguageSelector() {
  const selected = useGlobalStore((s) => s.language);
  const dd = useDropdown();

  return (
    <div ref={dd.wrapperRef} className="relative">
      <button
        onClick={dd.toggle}
        className="flex h-9 items-center gap-1.5 rounded-pill bg-muted px-3"
      >
        <Globe size={16} className="text-muted-foreground" />
        <span className="text-[13px] font-medium text-foreground">{selected}</span>
        <ChevronDown
          size={14}
          className="text-muted-foreground"
          style={dd.chevronStyle}
        />
      </button>

      {dd.mounted && (
        <div
          onAnimationEnd={dd.handleAnimationEnd}
          className="absolute right-0 top-full z-50 mt-2 w-[180px] origin-top-right rounded-[12px] bg-[var(--s-card)] p-2 shadow-[0_4px_16px_var(--s-shadow)]"
          style={dd.panelStyle}
        >
          <div className="flex flex-col gap-1">
            {LANGUAGES.map((lang, i) => (
              <LanguageOption
                key={lang.code}
                lang={lang}
                isSelected={selected === lang.code}
                onSelect={() => {
                  setLanguage(lang.code);
                  dd.close();
                }}
                style={dd.itemStyle(i)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
