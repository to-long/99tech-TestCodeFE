import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useIntl } from "react-intl";
import { TOKENS } from "../data/tokens";
import type { Token } from "../types/token";

interface TokenSelectorProps {
  selectedSymbol: string;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

const MOST_USED_COUNT = 3;

function formatBalance(balance: number): string {
  const str = String(balance);
  const decimals = str.includes(".") ? str.split(".")[1].length : 0;
  return balance.toLocaleString(undefined, {
    minimumFractionDigits: Math.max(decimals, 2),
    maximumFractionDigits: Math.max(decimals, 2),
  });
}

function TokenRow({
  token,
  isSelected,
  onSelect,
}: {
  token: Token;
  isSelected: boolean;
  onSelect: (token: Token) => void;
}) {
  return (
    <button
      onClick={() => onSelect(token)}
      className={`flex h-14 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 ${
        isSelected ? "bg-[var(--s-highlight)]" : "hover:bg-[var(--s-field)]"
      }`}
    >
      <img
        src={token.image}
        alt={token.symbol}
        className="h-9 w-9 rounded-full"
      />
      <div className="flex flex-1 flex-col items-start gap-px">
        <span className="font-['Funnel_Sans'] text-[15px] font-semibold text-[var(--s-text)]">
          {token.symbol}
        </span>
        <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
          {token.name}
        </span>
      </div>
      <span className="font-['Geist'] text-sm font-medium text-[var(--s-text)]">
        {formatBalance(token.balance)}
      </span>
    </button>
  );
}

export default function TokenSelector({
  selectedSymbol,
  onSelect,
  onClose,
}: TokenSelectorProps) {
  const intl = useIntl();
  const t = (id: string) => intl.formatMessage({ id });
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on mount
    requestAnimationFrame(() => setVisible(true));

    // Close on Esc key
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") handleClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const filtered = TOKENS.filter(
    (t) =>
      t.symbol.toLowerCase().includes(search.toLowerCase()) ||
      t.name.toLowerCase().includes(search.toLowerCase()),
  );

  const mostUsed = filtered.slice(0, MOST_USED_COUNT);
  const available = filtered.slice(MOST_USED_COUNT);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 250);
  }

  function handleSelect(token: Token) {
    setVisible(false);
    setTimeout(() => onSelect(token), 250);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300"
      style={{
        backgroundColor: visible ? "var(--s-backdrop)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        className="w-[380px] overflow-hidden rounded-2xl bg-[var(--s-card)] shadow-[0_8px_24px_var(--s-shadow)] transition-all duration-300"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.95) translateY(16px)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pb-3 pt-4">
          <span className="font-['Funnel_Sans'] text-lg font-bold text-[var(--s-text)]">
            {t("tokenSelector.title")}
          </span>
          <button
            onClick={handleClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors duration-150 hover:bg-[var(--s-field)]"
          >
            <X size={18} className="text-[var(--s-text-sub)]" />
          </button>
        </div>

        {/* Search */}
        <div className="px-5 pb-2">
          <div className="flex h-11 items-center gap-2.5 rounded-lg border border-[var(--s-border)] bg-[var(--s-field)] px-3.5">
            <Search size={16} className="text-[var(--s-text-sub)]" />
            <input
              type="text"
              placeholder={t("tokenSelector.search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent font-['Geist'] text-sm text-[var(--s-text)] outline-none placeholder:text-[var(--s-text-dim)]"
            />
          </div>
        </div>

        {/* Token List */}
        <div className="flex max-h-[442px] flex-col gap-1 overflow-y-auto px-1.5 pb-1.5">
          {/* Most Used Section */}
          {mostUsed.length > 0 && (
            <>
              <span className="px-3 pb-0.5 pt-2 font-['Geist'] text-[11px] font-semibold tracking-wider text-[var(--s-text-muted)]">
                {t("tokenSelector.mostUsed")}
              </span>
              {mostUsed.map((token) => (
                <TokenRow
                  key={token.symbol}
                  token={token}
                  isSelected={token.symbol === selectedSymbol}
                  onSelect={handleSelect}
                />
              ))}
            </>
          )}

          {/* Available Section */}
          {available.length > 0 && (
            <>
              <span className="px-3 pb-0.5 pt-2 font-['Geist'] text-[11px] font-semibold tracking-wider text-[var(--s-text-muted)]">
                {t("tokenSelector.available")}
              </span>
              {available.map((token) => (
                <TokenRow
                  key={token.symbol}
                  token={token}
                  isSelected={token.symbol === selectedSymbol}
                  onSelect={handleSelect}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
