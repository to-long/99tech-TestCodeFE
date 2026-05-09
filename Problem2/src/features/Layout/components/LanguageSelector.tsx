import { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown } from "lucide-react";
import { useGlobalStore, setLanguage } from "../store/useGlobalStore";
import { LANGUAGES } from "../data/languages";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import LanguageOption from "./LanguageOption";

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  /** Controls CSS visibility so the exit animation can play before unmount. */
  const [visible, setVisible] = useState(false);
  const selected = useGlobalStore((s) => s.language);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  // Two-phase open/close: mount → animate-in, animate-out → unmount.
  useEffect(() => {
    if (open) {
      // Mount first, then flip `visible` on the next frame so the
      // browser picks up the transition from the initial state.
      const id = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(id);
    } else {
      setVisible(false);
    }
  }, [open]);

  /** Keep the dropdown mounted until the closing transition ends. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (open) {
      setMounted(true);
    }
    // Unmount is handled by `onTransitionEnd` below.
  }, [open]);

  function handleTransitionEnd() {
    if (!open) setMounted(false);
  }

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
          className={`text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {mounted && (
        <div
          onTransitionEnd={handleTransitionEnd}
          className="absolute right-0 top-full z-50 mt-2 w-[180px] origin-top-right rounded-[12px] bg-[var(--s-card)] p-2 shadow-[0_4px_16px_var(--s-shadow)] transition-[opacity,transform] duration-200 ease-out"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "scale(1) translateY(0)"
              : "scale(0.95) translateY(-4px)",
            pointerEvents: open ? "auto" : "none",
          }}
        >
          <div className="flex flex-col gap-1">
            {LANGUAGES.map((lang, i) => (
              <LanguageOption
                key={lang.code}
                lang={lang}
                isSelected={selected === lang.code}
                onSelect={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible
                    ? "translateY(0)"
                    : "translateY(-6px)",
                  transition: `opacity 200ms ease-out ${i * 40}ms, transform 200ms ease-out ${i * 40}ms`,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
