import { useRef } from "react";
import { Controller } from "react-hook-form";
import {
  useSwapStore,
  openSelector,
  getToAmount,
  getUsdValue,
} from "../store/useSwapStore";
import { useSwapAnimation } from "../hooks/useSwapAnimation";
import { useSwapForm, buildAmountRules } from "../hooks/useSwapForm";
import SwapHeader from "./SwapHeader";
import SwapInputCard from "./SwapInputCard";
import SwapDirectionButton from "./SwapDirectionButton";
import SwapRateInfo from "./SwapRateInfo";
import SwapActionButton from "./SwapActionButton";
import SwapFooter from "./SwapFooter";

/** The "front" face of the flip card: full swap form. */
export default function SwapCardBody() {
  const { fromToken, toToken, fromAmount, prices } = useSwapStore();

  const fromRef = useRef<HTMLDivElement>(null);
  const toRef = useRef<HTMLDivElement>(null);
  const { offset, swapping, trigger } = useSwapAnimation(fromRef, toRef);

  const { control, errorMessage, isValid, handleAmountChange } = useSwapForm();

  const toAmount = getToAmount(fromAmount, fromToken.symbol, toToken.symbol, prices);
  const fromUsd = getUsdValue(parseFloat(fromAmount) || 0, fromToken.symbol, prices);
  const toUsd = getUsdValue(toAmount, toToken.symbol, prices);

  return (
    <div className="rounded-2xl bg-[var(--s-card)] transition-colors duration-300">
      <SwapHeader />

      <div className="relative flex flex-col gap-4 px-5 pb-5 pt-3">
        <Controller
          name="fromAmount"
          control={control}
          rules={buildAmountRules(fromToken.balance)}
          render={({ field }) => (
            <SwapInputCard
              ref={fromRef}
              variant="from"
              token={fromToken}
              amount={field.value ?? ""}
              usdValue={fromUsd}
              offset={offset.from}
              swapping={swapping}
              onTokenClick={() => openSelector("from")}
              onAmountChange={(raw) => handleAmountChange(raw, field.onChange)}
              errorMessage={errorMessage}
            />
          )}
        />

        <SwapDirectionButton swapping={swapping} onClick={trigger} />

        <SwapInputCard
          ref={toRef}
          variant="to"
          token={toToken}
          amount={toAmount}
          usdValue={toUsd}
          offset={offset.to}
          swapping={swapping}
          onTokenClick={() => openSelector("to")}
        />

        <SwapRateInfo />
        <SwapActionButton disabled={!isValid} />
        <SwapFooter />
      </div>
    </div>
  );
}
