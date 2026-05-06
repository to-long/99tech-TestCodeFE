import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useGlobalStore, setLanguage } from "../store/useGlobalStore";

const LANGUAGES = [
  { code: "EN", label: "English", flag: "🇬🇧" },
  { code: "ZH", label: "中文", flag: "🇨🇳" },
  { code: "TH", label: "ไทย", flag: "🇹🇭" },
];

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const selected = useGlobalStore((s) => s.language);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex h-9 items-center gap-1.5 rounded-pill bg-muted px-3"
      >
        <Globe size={16} className="text-muted-foreground" />
        <span className="text-[13px] font-medium text-foreground">
          {selected}
        </span>
        <ChevronDown
          size={14}
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[180px] rounded-[12px] bg-[var(--s-card)] p-2 shadow-[0_4px_16px_var(--s-shadow)]">
          <div className="flex flex-col gap-1">
            {LANGUAGES.map((lang) => {
              const isSelected = selected === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as "EN" | "ZH" | "TH");
                    setOpen(false);
                  }}
                  className={`flex h-10 items-center gap-3 rounded-[8px] px-3 ${
                    isSelected ? "bg-[var(--s-green-bg)]" : "hover:bg-muted"
                  }`}
                >
                  <span className="text-lg leading-none">
                    {lang.flag}
                  </span>
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
                  {isSelected && (
                    <Check size={16} className="text-[var(--s-btn)]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
