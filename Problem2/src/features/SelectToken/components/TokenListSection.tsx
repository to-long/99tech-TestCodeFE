import type { Token } from "../../SwapToken/types/token";
import TokenRow from "./TokenRow";

interface Props {
  label: string;
  tokens: Token[];
  selectedSymbol: string;
  onSelect: (token: Token) => void;
}

export default function TokenListSection({
  label,
  tokens,
  selectedSymbol,
  onSelect,
}: Props) {
  if (tokens.length === 0) return null;
  return (
    <>
      <span className="px-3 pb-0.5 pt-2 font-['Geist'] text-[11px] font-semibold tracking-wider text-[var(--s-text-muted)]">
        {label}
      </span>
      {tokens.map((token) => (
        <TokenRow
          key={token.symbol}
          token={token}
          isSelected={token.symbol === selectedSymbol}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}
