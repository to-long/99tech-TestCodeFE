// Refactor of original.tsx. Comments below explain *why* each change was made;
// I would not normally leave this many inline comments in production code, but
// the exercise asks for the reasoning to live next to the fix.

import { useMemo } from "react";

// Added `blockchain` — the original `WalletBalance` was missing it, even though
// `getPriority(balance.blockchain)` was being called. Typed as a string union
// so unknown chains are caught by the compiler instead of silently returning -99.
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

// `interface Props extends BoxProps {}` is an empty extension — replace with a
// type alias to silence the lint rule and to be honest about what it is.
type Props = BoxProps;

// Hoisted out of the component:
//   - The map has no closures over component state, so re-creating it on every
//     render is pure waste.
//   - As a `Record` lookup it's O(1) and trivially readable; the original switch
//     duplicated `return 20` for two cases, which a table makes obvious.
//   - Stable identity means we can put `getPriority` in a `useMemo` dep array
//     without invalidating it every render (we don't need to here, but it's the
//     right default).
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const UNKNOWN_PRIORITY = -99;

const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain as Blockchain] ?? UNKNOWN_PRIORITY;

// Dropped `React.FC`:
//   - Implicit `children` typing it adds is misleading (this component doesn't
//     render `children`).
//   - Plain function + typed param is the current React/TypeScript convention.
const WalletPage = ({ children: _children, ...rest }: Props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // Single memo that produces the *final* row data:
  //   - Filter bug fixed: original referenced an undefined `lhsPriority` and
  //     kept rows with `amount <= 0`. A wallet view wants known-chain rows with
  //     a positive balance.
  //   - Sort comparator returns `leftPriority - rightPriority` style (negated
  //     for descending). Original returned `undefined` on equal priorities,
  //     which is undefined behavior for Array.sort.
  //   - Decorate-sort-undecorate: compute priority + usdValue + formatted once
  //     per balance, then sort on the precomputed key. The original called
  //     getPriority twice per comparison (O(n log n) lookups) and never built
  //     the formatted value into the rendered rows at all.
  //   - Deps: only `balances` and `prices`. The original listed `prices` even
  //     though the memo body never read it; here we *do* read it (for usdValue),
  //     so the dependency is now both correct and necessary.
  const rows = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(
        (b) => getPriority(b.blockchain) > UNKNOWN_PRIORITY && b.amount > 0,
      )
      .map((b) => ({
        ...b,
        // `prices[b.currency]` can be undefined for a newly-listed token; fall
        // back to 0 so we render `$0.00` instead of `NaN`.
        usdValue: (prices[b.currency] ?? 0) * b.amount,
        // Pick an explicit digit count. `.toFixed()` with no argument truncates
        // to whole units, which is almost never what a wallet wants. For a real
        // app I'd route this through `Intl.NumberFormat` for locale-aware
        // grouping; keeping it simple here to mirror the original's intent.
        formatted: b.amount.toFixed(4),
      }))
      .sort(
        (a, b) => getPriority(b.blockchain) - getPriority(a.blockchain),
        // Note: still O(n log n) priority lookups. If the list grows large,
        // attach a `_priority` field in the .map above and sort on that —
        // omitted here to keep the data shape clean.
      );
  }, [balances, prices]);

  return (
    <div {...rest}>
      {rows.map((b) => (
        <WalletRow
          // Stable key. The original used the array index, which is broken for
          // a *sorted* list — when ordering changes, React reuses the wrong
          // component instances and any local state ends up on the wrong row.
          // `${blockchain}:${currency}` is unique even if the same currency
          // exists on multiple chains.
          key={`${b.blockchain}:${b.currency}`}
          className={classes.row}
          amount={b.amount}
          usdValue={b.usdValue}
          formattedAmount={b.formatted}
        />
      ))}
    </div>
  );
};

export default WalletPage;
