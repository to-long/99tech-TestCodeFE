import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Info, ChevronDown, Link, Copy, Check } from "lucide-react";
import { useIntl } from "react-intl";
import {
  useSwapStore,
  closeSettings,
  setSlippage,
  setCustomSlippage,
  setDeadline,
  setNetwork,
  setRefreshRate,
  setExpertMode,
  setMultihopTrades,
} from "../store/useSwapStore";

export const NETWORKS = [
  { id: "ethereum", name: "Ethereum", gas: "~$2.45", color: "#627EEA", icon: "Ξ" },
  { id: "polygon", name: "Polygon", gas: "~$0.02", color: "#8247E5", icon: "P" },
  { id: "bnb", name: "BNB Chain", gas: "~$0.15", color: "#F3BA2F", icon: "B" },
  { id: "optimism", name: "Optimism", gas: "~$0.08", color: "#FF0420", icon: "O" },
  { id: "arbitrum", name: "Arbitrum", gas: "~$0.12", color: "#28A0F0", icon: "A" },
];

const SLIPPAGE_PRESETS = [
  { value: 0.1, label: "0.1%" },
  { value: 0.5, label: "0.5%" },
  { value: 1.0, label: "1.0%" },
] as const;

const REFRESH_RATES = [
  { value: 5, label: "5s" },
  { value: 10, label: "10s" },
  { value: 30, label: "30s" },
  { value: 60, label: "60s" },
] as const;

function SectionHeader({ label, tooltip }: { label: string; tooltip: string }) {
  const [showTip, setShowTip] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0, side: "right" as "right" | "left" | "bottom" });

  const updatePos = useCallback(() => {
    if (!iconRef.current) return;
    const rect = iconRef.current.getBoundingClientRect();
    const tipW = 208;
    const gap = 10;

    // Find card boundary to avoid overlap
    const card = iconRef.current.closest(".w-\\[380px\\]");
    const cardRect = card?.getBoundingClientRect();
    const cardRight = cardRect?.right ?? rect.right;
    const cardLeft = cardRect?.left ?? rect.left;

    const spaceRight = window.innerWidth - cardRight - gap;
    const spaceLeft = cardLeft - gap;

    if (spaceRight >= tipW) {
      // Desktop: right of card, no overlap
      setPos({ top: rect.top + rect.height / 2, left: cardRight + gap, side: "right" });
    } else if (spaceLeft >= tipW) {
      // Left of card, no overlap
      setPos({ top: rect.top + rect.height / 2, left: cardLeft - gap - tipW, side: "left" });
    } else {
      // Narrow viewport: show below icon, right-aligned
      setPos({ top: rect.bottom + gap, left: Math.max(gap, rect.right - tipW), side: "bottom" });
    }
  }, []);

  useEffect(() => {
    if (!showTip) return;
    updatePos();
    function handleClick(e: MouseEvent) {
      if (
        tipRef.current && !tipRef.current.contains(e.target as Node) &&
        iconRef.current && !iconRef.current.contains(e.target as Node)
      ) {
        setShowTip(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showTip, updatePos]);

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

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-[24px] w-[40px] cursor-pointer rounded-full p-1 transition-all duration-200 ${
        checked ? "bg-[#5749F4] hover:bg-[#4538D4]" : "bg-[#C5C5CB] hover:bg-[#B0B0B8]"
      } hover:shadow-[0_0_0_3px_#5749F415]`}
    >
      <div
        className="h-3 w-5 rounded-full bg-white transition-transform duration-200"
        style={{ transform: checked ? "translateX(12px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function SettingsPanel() {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });

  const {
    slippage,
    customSlippage,
    deadline,
    network,
    refreshRate,
    apiEndpoint,
    expertMode,
    multihopTrades,
  } = useSwapStore();

  const [editingDeadline, setEditingDeadline] = useState(false);
  const [deadlineInput, setDeadlineInput] = useState(String(deadline));
  const [copied, setCopied] = useState(false);
  const [networkOpen, setNetworkOpen] = useState(false);
  const networkRef = useRef<HTMLDivElement>(null);

  const selectedNetwork = NETWORKS.find((n) => n.id === network) ?? NETWORKS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (networkRef.current && !networkRef.current.contains(e.target as Node)) {
        setNetworkOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleDeadlineBlur() {
    const parsed = parseInt(deadlineInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setDeadline(parsed);
    } else {
      setDeadlineInput(String(deadline));
    }
    setEditingDeadline(false);
  }

  function handleCopyEndpoint() {
    try {
      navigator.clipboard.writeText(apiEndpoint).catch(() => {});
    } catch {
      // fallback: clipboard not available
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="w-[380px] rounded-2xl bg-[var(--s-card)] shadow-[0_8px_24px_var(--s-shadow)] transition-colors duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--s-border-light)] px-5 pb-3 pt-[14px]">
        <span className="font-['Funnel_Sans'] text-lg font-bold text-[var(--s-text)]">
          {t("settings.title")}
        </span>
        <button onClick={closeSettings} className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--s-field)]">
          <X size={20} className="text-[var(--s-text-sub)]" />
        </button>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-4 px-5 pb-5 pt-3">
        {/* Slippage Tolerance */}
        <div className="flex flex-col gap-3">
          <SectionHeader label={t("settings.slippage")} tooltip={t("settings.slippageTip")} />
          <div className="flex gap-2">
            {SLIPPAGE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setSlippage(preset.value)}
                className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg font-['Inter'] text-sm font-medium transition-all duration-200 ${
                  slippage === preset.value
                    ? "bg-[var(--s-btn)] font-semibold text-white"
                    : "bg-[var(--s-field)] text-[var(--s-text-sub)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
            <button
              onClick={() => setSlippage("custom")}
              className={`flex h-10 flex-1 cursor-pointer items-center justify-center rounded-lg font-['Inter'] text-[13px] transition-all duration-200 ${
                slippage === "custom"
                  ? "bg-[var(--s-btn)] font-semibold text-white"
                  : "bg-[var(--s-field)] text-[var(--s-text-dim)]"
              }`}
            >
              {slippage === "custom" && customSlippage
                ? `${customSlippage}%`
                : t("settings.custom")}
            </button>
          </div>
          {slippage === "custom" && (
            <div className="flex h-10 items-center gap-2 rounded-lg bg-[var(--s-field)] px-3.5">
              <input
                type="text"
                value={customSlippage}
                onChange={(e) => setCustomSlippage(e.target.value)}
                placeholder="0.00"
                className="flex-1 bg-transparent font-['Inter'] text-sm text-[var(--s-text)] outline-none placeholder:text-[var(--s-text-dim)]"
              />
              <span className="font-['Inter'] text-sm text-[var(--s-text-dim)]">%</span>
            </div>
          )}
        </div>

        {/* Transaction Deadline */}
        <div className="flex flex-col gap-3">
          <SectionHeader label={t("settings.deadline")} tooltip={t("settings.deadlineTip")} />
          <div
            className="flex h-11 cursor-text items-center justify-between rounded-lg bg-[var(--s-field)] px-3.5"
            onClick={() => {
              setEditingDeadline(true);
              setDeadlineInput(String(deadline));
            }}
          >
            {editingDeadline ? (
              <input
                type="text"
                value={deadlineInput}
                onChange={(e) => setDeadlineInput(e.target.value)}
                onBlur={handleDeadlineBlur}
                onKeyDown={(e) => e.key === "Enter" && handleDeadlineBlur()}
                autoFocus
                className="w-16 bg-transparent font-['Inter'] text-[15px] font-medium text-[var(--s-text)] outline-none"
              />
            ) : (
              <span className="font-['Inter'] text-[15px] font-medium text-[var(--s-text)]">
                {deadline}
              </span>
            )}
            <span className="font-['Inter'] text-sm text-[var(--s-text-dim)]">
              {t("settings.deadlineUnit")}
            </span>
          </div>
        </div>

        {/* Network */}
        <div ref={networkRef} className="relative flex flex-col gap-2">
          <SectionHeader label={t("settings.network")} tooltip={t("settings.networkTip")} />
          <button
            onClick={() => setNetworkOpen(!networkOpen)}
            className="flex h-11 cursor-pointer items-center justify-between rounded-lg bg-[var(--s-field)] px-3.5"
          >
            <div className="flex items-center gap-2.5">
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--s-border-icon)]"
                style={{ backgroundColor: selectedNetwork.color }}
              >
                <span className="text-[8px] font-bold text-white">
                  {selectedNetwork.icon}
                </span>
              </div>
              <span className="font-['Inter'] text-sm font-medium text-[var(--s-text)]">
                {selectedNetwork.name}
              </span>
              <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                {selectedNetwork.gas} gas
              </span>
            </div>
            <ChevronDown
              size={16}
              className={`text-[var(--s-text-sub)] transition-transform duration-200 ${networkOpen ? "rotate-180" : ""}`}
            />
          </button>

          {networkOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 flex flex-col gap-0.5 rounded-xl bg-[var(--s-card)] p-1.5 shadow-[0_8px_24px_var(--s-shadow)]">
              {NETWORKS.map((net) => {
                const isSelected = net.id === network;
                return (
                  <button
                    key={net.id}
                    onClick={() => {
                      setNetwork(net.id);
                      setNetworkOpen(false);
                    }}
                    className={`flex h-[42px] cursor-pointer items-center gap-2 rounded-lg px-3 transition-colors duration-150 ${
                      isSelected ? "bg-[var(--s-highlight)]" : "hover:bg-[var(--s-field)]"
                    }`}
                  >
                    <div
                      className="flex h-6 w-6 items-center justify-center rounded-full border border-[var(--s-border-icon)]"
                      style={{ backgroundColor: net.color }}
                    >
                      <span className="text-[8px] font-bold text-white">
                        {net.icon}
                      </span>
                    </div>
                    <span
                      className={`font-['Inter'] text-sm text-[var(--s-text)] ${isSelected ? "font-semibold" : "font-medium"}`}
                    >
                      {net.name}
                    </span>
                    <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
                      {net.gas} gas
                    </span>
                    <div className="flex-1" />
                    {isSelected && (
                      <Check size={14} className="text-[var(--s-btn)]" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Price Refresh Rate */}
        <div className="flex flex-col gap-2">
          <SectionHeader label={t("settings.refreshRate")} tooltip={t("settings.refreshRateTip")} />
          <div className="flex gap-2">
            {REFRESH_RATES.map((rate) => (
              <button
                key={rate.value}
                onClick={() => setRefreshRate(rate.value)}
                className={`flex h-9 flex-1 cursor-pointer items-center justify-center rounded-md font-['Inter'] text-[13px] font-medium transition-all duration-200 ${
                  refreshRate === rate.value
                    ? "bg-[var(--s-btn)] font-semibold text-white"
                    : "bg-[var(--s-field)] text-[var(--s-text-sub)]"
                }`}
              >
                {rate.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price API Endpoint */}
        <div className="flex flex-col gap-2">
          <SectionHeader label={t("settings.apiEndpoint")} tooltip={t("settings.apiEndpointTip")} />
          <div className="flex h-11 items-center gap-2 rounded-lg bg-[var(--s-field)] px-3.5">
            <Link size={14} className="shrink-0 text-[var(--s-text-sub)]" />
            <span className="flex-1 truncate font-['Geist'] text-[13px] text-[var(--s-text)]">
              {apiEndpoint}
            </span>
            <button onClick={handleCopyEndpoint} className="shrink-0 cursor-pointer transition-colors duration-200">
              {copied ? (
                <Check size={14} className="text-[var(--s-btn)]" />
              ) : (
                <Copy size={14} className="text-[var(--s-text-sub)]" />
              )}
            </button>
          </div>
        </div>

        {/* Expert Mode */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-['Inter'] text-sm font-semibold text-[var(--s-text)]">
              {t("settings.expertMode")}
            </span>
            <span className="font-['Inter'] text-xs text-[var(--s-text-dim)]">
              {t("settings.expertModeDesc")}
            </span>
          </div>
          <Toggle checked={expertMode} onChange={setExpertMode} />
        </div>

        {/* Multi-hop Trades */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-['Inter'] text-sm font-semibold text-[var(--s-text)]">
              {t("settings.multihop")}
            </span>
            <span className="font-['Inter'] text-xs text-[var(--s-text-dim)]">
              {t("settings.multihopDesc")}
            </span>
          </div>
          <Toggle checked={multihopTrades} onChange={setMultihopTrades} />
        </div>
      </div>
    </div>
  );
}
