import { useState, useRef } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useGlobalStore, setLanguage } from "../store/useGlobalStore";
import { LANGUAGES } from "../data/languages";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import LanguageOption from "./LanguageOption";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const selected = useGlobalStore((s) => s.language);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-1.5 rounded-pill bg-muted px-3"
      >
        <Globe size={16} className="text-muted-foreground" />
        <span className="text-[13px] font-medium text-foreground">{selected}</span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[180px] rounded-[12px] bg-[var(--s-card)] p-2 shadow-[0_4px_16px_var(--s-shadow)]">
          <div className="flex flex-col gap-1">
            {LANGUAGES.map((lang) => (
              <LanguageOption
                key={lang.code}
                lang={lang}
                isSelected={selected === lang.code}
                onSelect={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
