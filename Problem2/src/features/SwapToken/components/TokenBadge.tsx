import { ChevronDown } from "lucide-react";
import type { Token } from "../types/token";

interface Props {
  token: Token;
  onClick: () => void;
}

export default function TokenBadge({ token, onClick }: Props) {
  return (
    <button onClick={onClick} className="flex cursor-pointer items-center gap-2.5">
      <img src={token.image} alt={token.symbol} className="h-10 w-10 rounded-full" />
      <div className="flex flex-col items-start gap-0.5">
        <span className="font-['Funnel_Sans'] text-lg font-bold text-[var(--s-text)]">
          {token.symbol}
        </span>
        <span className="font-['Geist'] text-[11px] text-[var(--s-text-sub)]">
          {token.name}
        </span>
      </div>
      <ChevronDown size={16} className="text-[var(--s-text-sub)]" />
    </button>
  );
}
