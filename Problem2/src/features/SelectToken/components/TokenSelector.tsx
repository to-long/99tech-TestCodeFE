import { useState } from "react";
import { X } from "lucide-react";
import { TOKENS } from "../../SwapToken/data/tokens";
import type { Token } from "../../SwapToken/types/token";
import { useT } from "../../../shared/hooks/useT";
import { useEscapeKey } from "../../../shared/hooks/useEscapeKey";
import { useModalAnimation } from "../hooks/useModalAnimation";
import { filterTokens, partitionTokens } from "../utils/filterTokens";
import TokenSearchInput from "./TokenSearchInput";
import TokenListSection from "./TokenListSection";

interface Props {
  selectedSymbol: string;
  onSelect: (token: Token) => void;
  onClose: () => void;
}

export default function TokenSelector({ selectedSymbol, onSelect, onClose }: Props) {
  const t = useT();
  const [search, setSearch] = useState("");
  const { visible, close } = useModalAnimation();

  const handleClose = () => close(onClose);
  const handleSelect = (token: Token) => close(() => onSelect(token));

  useEscapeKey(handleClose);

  const { mostUsed, available } = partitionTokens(filterTokens(TOKENS, search));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-all duration-300"
      style={{
        backgroundColor: visible ? "var(--s-backdrop)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        className="mx-3 w-full max-w-[380px] overflow-hidden rounded-2xl bg-[var(--s-card)] shadow-[0_8px_24px_var(--s-shadow)] transition-all duration-300"
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

        <TokenSearchInput
          value={search}
          placeholder={t("tokenSelector.search")}
          onChange={setSearch}
        />

        {/* Token List */}
        <div className="flex max-h-[442px] flex-col gap-1 overflow-y-auto px-1.5 pb-1.5">
          <TokenListSection
            label={t("tokenSelector.mostUsed")}
            tokens={mostUsed}
            selectedSymbol={selectedSymbol}
            onSelect={handleSelect}
          />
          <TokenListSection
            label={t("tokenSelector.available")}
            tokens={available}
            selectedSymbol={selectedSymbol}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </div>
  );
}
