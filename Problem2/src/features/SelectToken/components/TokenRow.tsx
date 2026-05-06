import type { Token } from "../../SwapToken/types/token";
import { formatBalance } from "../../../shared/utils/formatNumber";

interface Props {
  token: Token;
  isSelected: boolean;
  onSelect: (token: Token) => void;
}

export default function TokenRow({ token, isSelected, onSelect }: Props) {
  return (
    <button
      onClick={() => onSelect(token)}
      className={`flex h-14 cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors duration-150 ${
        isSelected ? "bg-[var(--s-highlight)]" : "hover:bg-[var(--s-field)]"
      }`}
    >
      <img src={token.image} alt={token.symbol} className="h-9 w-9 rounded-full" />
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
