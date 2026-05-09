import { useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { useClickOutside } from "@shared/hooks/useClickOutside";
import { useTooltipPosition } from "../hooks/useTooltipPosition";

interface Props {
  label: string;
  tooltip: string;
}

export default function SectionHeader({ label, tooltip }: Props) {
  const [showTip, setShowTip] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const pos = useTooltipPosition(iconRef, showTip);

  useClickOutside([iconRef, tipRef], () => setShowTip(false), showTip);

  return (
    <div className="flex w-full items-center justify-between">
      <span className="font-['Inter'] text-sm font-semibold text-[var(--s-text)]">
        {label}
      </span>
      <button
        ref={iconRef}
        onClick={() => setShowTip(!showTip)}
        className="flex cursor-pointer items-center justify-center rounded-full p-0.5 transition-colors duration-150 hover:bg-[var(--s-field)]"
      >
        <Info size={14} className="text-[var(--s-text-sub)]" />
      </button>
      {showTip &&
        createPortal(
          <div
            ref={tipRef}
            className={`fixed z-[9999] w-52 rounded-lg bg-[var(--s-text)] px-3 py-2 shadow-lg ${
              pos.side !== "bottom" ? "-translate-y-1/2" : ""
            }`}
            style={{ top: pos.top, left: pos.left }}
          >
            <span className="font-['Inter'] text-xs leading-relaxed text-[var(--s-card)]">
              {tooltip}
            </span>
            {pos.side === "right" && (
              <div className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[var(--s-text)]" />
            )}
            {pos.side === "left" && (
              <div className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rotate-45 bg-[var(--s-text)]" />
            )}
            {pos.side === "bottom" && (
              <div className="absolute right-3 top-[-4px] h-2 w-2 rotate-45 bg-[var(--s-text)]" />
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
