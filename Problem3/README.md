# Problem 3

Code review and refactor of a React + TypeScript `WalletPage` component.

## Files

- `original.tsx` — the original code with issues.
- `refactor.tsx` — the cleaned-up version with inline comments explaining every change.

## Issues Found

### Bug 1: `lhsPriority` is undefined

The code computes `balancePriority` but then checks `lhsPriority`, which was never declared. This causes a `ReferenceError` at runtime.

```tsx
// ❌ Original
const balancePriority = getPriority(balance.blockchain);
if (lhsPriority > -99) {   // lhsPriority is never declared
```

```tsx
// ✅ Fix
const balancePriority = getPriority(balance.blockchain);
if (balancePriority > -99) {
```

---

### Bug 2: Inverted filter logic

The filter keeps balances where `amount <= 0` (zero or negative). A wallet UI should display positive balances.

```tsx
// ❌ Original — keeps negative/zero balances, discards positive ones
if (balance.amount <= 0) {
  return true;
}
```

```tsx
// ✅ Fix — only keep positive balances
if (balance.amount > 0) {
  return true;
}
```

---

### Bug 3: Sort comparator missing equal case

When `leftPriority === rightPriority`, the comparator returns `undefined`. This is undefined behavior for `Array.prototype.sort` — results may vary across browsers.

```tsx
// ❌ Original — no return when priorities are equal
if (leftPriority > rightPriority) {
  return -1;
} else if (rightPriority > leftPriority) {
  return 1;
}
// implicit return undefined
```

```tsx
// ✅ Fix — subtraction covers all three cases (<, >, =)
.sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
```

---

### Bug 4: `WalletBalance` missing `blockchain` field

The code reads `balance.blockchain` but the interface does not declare that property.

```tsx
// ❌ Original
interface WalletBalance {
  currency: string;
  amount: number;
  // blockchain is missing
}
```

```tsx
// ✅ Fix
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: Blockchain;
}
```

---

### Bug 5: `formattedBalances` computed but never used

`formattedBalances` maps `sortedBalances` into objects with a `formatted` field, but `rows` maps over `sortedBalances` instead — so `formatted` is never available at render time.

```tsx
// ❌ Original
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return { ...balance, formatted: balance.amount.toFixed() }
})

// rows uses sortedBalances, not formattedBalances!
const rows = sortedBalances.map((balance: FormattedWalletBalance, ...) => {
  // balance.formatted is undefined because sortedBalances lacks this field
  formattedAmount={balance.formatted}
})
```

```tsx
// ✅ Fix — merge filter, format, and sort into a single useMemo
const rows = useMemo<FormattedWalletBalance[]>(() => {
  return balances
    .filter(...)
    .map((b) => ({
      ...b,
      formatted: b.amount.toFixed(4),
      usdValue: (prices[b.currency] ?? 0) * b.amount,
    }))
    .sort(...);
}, [balances, prices]);
```

---

### Bug 6: `prices[balance.currency]` can be undefined

When a newly listed token has no price entry, `prices[currency]` is `undefined`. Multiplying `undefined * number` yields `NaN`, which gets rendered into the UI.

```tsx
// ❌ Original
const usdValue = prices[balance.currency] * balance.amount;
// → NaN if currency is not in prices
```

```tsx
// ✅ Fix — fallback to 0
usdValue: (prices[b.currency] ?? 0) * b.amount,
```

---

### Bug 7: `children` destructured then silently dropped

`children` is extracted from props but never rendered. `...rest` excludes `children`, so any children passed by a parent component disappear.

```tsx
// ❌ Original
const { children, ...rest } = props;
// children is unused, ...rest does not contain children
return <div {...rest}>{rows}</div>
```

```tsx
// ✅ Fix — rename to _children to signal intentional omission
const WalletPage = ({ children: _children, ...rest }: Props) => {
```

---

### Anti-pattern 1: `getPriority` declared inside component

A pure function with no closures over state or props is re-created on every render. It should be hoisted to module scope.

```tsx
// ❌ Original — function recreated every render
const WalletPage: React.FC<Props> = (props: Props) => {
  const getPriority = (blockchain: any): number => {
    switch (blockchain) { ... }
  }
}
```

```tsx
// ✅ Fix — hoisted to module scope, Record lookup instead of switch
const BLOCKCHAIN_PRIORITY: Record<Blockchain, number> = {
  Osmosis: 100, Ethereum: 50, Arbitrum: 30, Zilliqa: 20, Neo: 20,
};

const getPriority = (blockchain: string): number =>
  BLOCKCHAIN_PRIORITY[blockchain as Blockchain] ?? -99;
```

---

### Anti-pattern 2: Wrong `useMemo` dependencies

`prices` is in the dependency array but the memo body never reads it — causing unnecessary recomputation whenever prices change.

```tsx
// ❌ Original — prices in deps but never used in body
const sortedBalances = useMemo(() => {
  return balances.filter(...).sort(...);
  // prices is never read
}, [balances, prices]);
```

```tsx
// ✅ Fix — prices is now actually consumed (to compute usdValue)
const rows = useMemo(() => {
  return balances
    .filter(...)
    .map((b) => ({ ...b, usdValue: (prices[b.currency] ?? 0) * b.amount, ... }))
    .sort(...);
}, [balances, prices]);
```

---

### Anti-pattern 3: `key={index}` on a sorted list

The list is sorted by priority, so indices shift when data changes. React will reconcile the wrong component instances, losing internal state.

```tsx
// ❌ Original
<WalletRow key={index} ... />
```

```tsx
// ✅ Fix — stable key, unique per blockchain + currency
<WalletRow key={`${b.blockchain}:${b.currency}`} ... />
```

---

### Anti-pattern 4: `blockchain: any`

Using `any` defeats TypeScript's type safety. Passing an invalid value produces no compiler error.

```tsx
// ❌ Original
const getPriority = (blockchain: any): number => { ... }
```

```tsx
// ✅ Fix
type Blockchain = "Osmosis" | "Ethereum" | "Arbitrum" | "Zilliqa" | "Neo";
const getPriority = (blockchain: string): number => ...
```

---

### Anti-pattern 5: Redundant `React.FC<Props>` + `(props: Props)`

`React.FC` already provides the props type, so the explicit `(props: Props)` annotation is redundant. `React.FC` also implicitly adds `children` to the props type, which is misleading when the component does not render children.

```tsx
// ❌ Original
const WalletPage: React.FC<Props> = (props: Props) => { ... }
```

```tsx
// ✅ Fix — plain function with destructured typed params
const WalletPage = ({ children: _children, ...rest }: Props) => { ... }
```

---

### Anti-pattern 6: Empty interface

An empty interface extending another is a lint warning and adds no value.

```tsx
// ❌ Original
interface Props extends BoxProps {}
```

```tsx
// ✅ Fix
type Props = BoxProps;
```

---

### Anti-pattern 7: `.toFixed()` with no argument

Defaults to 0 decimal places — rarely correct for currency display.

```tsx
// ❌ Original
formatted: balance.amount.toFixed()   // 1234.5678 → "1235"
```

```tsx
// ✅ Fix
formatted: b.amount.toFixed(4)        // 1234.5678 → "1234.5678"
```
