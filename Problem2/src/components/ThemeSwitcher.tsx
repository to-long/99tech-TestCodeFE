import { Sun, Moon } from "lucide-react";
import { useGlobalStore, toggleTheme } from "../store/useGlobalStore";

export default function ThemeSwitcher() {
  const theme = useGlobalStore((s) => s.theme);
  const isLight = theme === "light";

  return (
    <button
      onClick={toggleTheme}
      className="relative flex h-9 cursor-pointer items-center rounded-pill bg-muted p-1"
    >
      {/* Sliding indicator */}
      <div
        className="absolute h-7 w-8 rounded-[14px] bg-card shadow-[0_1px_2px_#00000010] transition-transform duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
        style={{ transform: isLight ? "translateX(0)" : "translateX(100%)" }}
      />

      <div className="relative z-[1] flex h-7 w-8 items-center justify-center">
        <Sun
          size={16}
          className="transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{
            color: isLight ? "#F59E0B" : undefined,
            transform: isLight ? "rotate(0deg) scale(1)" : "rotate(-90deg) scale(0.85)",
            opacity: isLight ? 1 : 0.5,
          }}
        />
      </div>
      <div className="relative z-[1] flex h-7 w-8 items-center justify-center">
        <Moon
          size={16}
          className="transition-all duration-300 ease-[cubic-bezier(.4,0,.2,1)]"
          style={{
            color: !isLight ? "#6366F1" : undefined,
            transform: !isLight ? "rotate(0deg) scale(1)" : "rotate(90deg) scale(0.85)",
            opacity: !isLight ? 1 : 0.5,
          }}
        />
      </div>
    </button>
  );
}
