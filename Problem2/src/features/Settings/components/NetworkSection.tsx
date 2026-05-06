import { useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useSwapStore, setNetwork } from "../../SwapToken/store/useSwapStore";
import { useT } from "../../../shared/hooks/useT";
import { useClickOutside } from "../../../shared/hooks/useClickOutside";
import { NETWORKS, getNetwork } from "../data/networks";
import SectionHeader from "./SectionHeader";
import NetworkIcon from "./NetworkIcon";

export default function NetworkSection() {
  const t = useT();
  const network = useSwapStore((s) => s.network);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setOpen(false), open);

  const selected = getNetwork(network);

  return (
    <div ref={ref} className="relative flex flex-col gap-2">
      <SectionHeader label={t("settings.network")} tooltip={t("settings.networkTip")} />
      <button
        onClick={() => setOpen(!open)}
        className="flex h-11 cursor-pointer items-center justify-between rounded-lg bg-[var(--s-field)] px-3.5"
      >
        <div className="flex items-center gap-2.5">
          <NetworkIcon network={selected} />
          <span className="font-['Inter'] text-sm font-medium text-[var(--s-text)]">
            {selected.name}
          </span>
          <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
            {selected.gas} gas
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`text-[var(--s-text-sub)] transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 flex flex-col gap-0.5 rounded-xl bg-[var(--s-card)] p-1.5 shadow-[0_8px_24px_var(--s-shadow)]">
          {NETWORKS.map((net) => {
            const isSelected = net.id === network;
            return (
              <button
                key={net.id}
                onClick={() => {
                  setNetwork(net.id);
                  setOpen(false);
                }}
                className={`flex h-[42px] cursor-pointer items-center gap-2 rounded-lg px-3 transition-colors duration-150 ${
                  isSelected ? "bg-[var(--s-highlight)]" : "hover:bg-[var(--s-field)]"
                }`}
              >
                <NetworkIcon network={net} />
                <span
                  className={`font-['Inter'] text-sm text-[var(--s-text)] ${
                    isSelected ? "font-semibold" : "font-medium"
                  }`}
                >
                  {net.name}
                </span>
                <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                  {net.gas} gas
                </span>
                <div className="flex-1" />
                {isSelected && <Check size={14} className="text-[var(--s-btn)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
