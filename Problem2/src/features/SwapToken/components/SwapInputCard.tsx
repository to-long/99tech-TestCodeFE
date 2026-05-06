import { forwardRef } from "react";
import type { Token } from "../types/token";
import { formatAmount } from "../../../shared/utils/formatNumber";
import { useT } from "../../../shared/hooks/useT";
import TokenBadge from "./TokenBadge";

interface Props {
  /** "from" inputs are editable; "to" inputs render a read-only amount. */
  variant: "from" | "to";
  token: Token;
  /** For variant="from": user-typed string; for variant="to": computed number. */
  amount: string | number;
  usdValue: number;
  /** Animation translateY offset (px) during the swap animation. */
  offset: number;
  swapping: boolean;
  onTokenClick: () => void;
  onAmountChange?: (value: string) => void;
}

const SwapInputCard = forwardRef<HTMLDivElement, Props>(function SwapInputCard(
  { variant, token, amount, usdValue, offset, swapping, onTokenClick, onAmountChange },
  ref,
) {
  const t = useT();
  const labelKey = variant === "from" ? "swap.youPay" : "swap.youReceive";
  const balanceFormatted =
    variant === "from"
      ? token.balance.toLocaleString()
      : token.balance.toLocaleString(undefined, { minimumFractionDigits: 2 });

  return (
    <div
      ref={ref}
      className="flex flex-col gap-3"
      style={{
        transform: `translateY(${offset}px)`,
        transition: swapping ? "transform 400ms cubic-bezier(.4,0,.2,1)" : "none",
        zIndex: swapping ? 2 : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span className="font-['Geist'] text-[13px] font-medium text-[var(--s-text-sub)]">
          {t(labelKey)}
        </span>
        <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
          {t("swap.balance", { balance: balanceFormatted, symbol: token.symbol })}
        </span>
      </div>
      <div className="flex h-[72px] items-center justify-between rounded-xl border border-[var(--s-border)] bg-[var(--s-field)] px-4 transition-colors duration-300">
        <TokenBadge token={token} onClick={onTokenClick} />
        <div className="flex flex-col items-end gap-0.5">
          {variant === "from" ? (
            <input
              type="text"
              value={amount as string}
              onChange={(e) => onAmountChange?.(e.target.value)}
              className="w-28 bg-transparent text-right font-['Funnel_Sans'] text-[28px] font-extrabold text-[var(--s-text)] outline-none"
            />
          ) : (
            <span className="font-['Funnel_Sans'] text-[28px] font-extrabold text-[var(--s-text)]">
              {formatAmount(amount as number)}
            </span>
          )}
          <span className="font-['Geist'] text-xs text-[var(--s-text-sub)]">
            ≈ ${formatAmount(usdValue)}
          </span>
        </div>
      </div>
    </div>
  );
});

export default SwapInputCard;
