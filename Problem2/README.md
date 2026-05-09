# Problem 2 — Swap Token Interface

A single-page token swap interface built with **React 19**, **TypeScript 5.8**, **Vite 6**, **Tailwind CSS v4**, and **Zustand 5**. Users can swap between 32 tokens with live exchange rates fetched from a remote API, with a fully validated input form, a 166-test unit suite, and a 26-story Storybook component catalog.

## Quick Start

```bash
cd Problem2
bun install
bun run dev      # http://localhost:5173
```

| Script                  | Description                                              |
| ----------------------- | -------------------------------------------------------- |
| `bun run dev`           | Start Vite dev server with HMR                           |
| `bun run build`         | Type-check + production build                            |
| `bun run preview`       | Preview the production build locally                     |
| `bun run test`          | Run the full vitest suite once                           |
| `bun run test:watch`    | vitest in watch mode                                     |
| `bun run test:coverage` | Run vitest + emit a v8 coverage report (`coverage/`)     |
| `bun run storybook`     | Start the Storybook dev server on `http://localhost:6006` |
| `bun run build-storybook` | Build the static component catalog into `storybook-static/` |

## Tech Stack

| Layer          | Technology                                            |
| -------------- | ----------------------------------------------------- |
| Runtime        | Bun                                                   |
| Framework      | React 19 + TypeScript 5.8                             |
| Bundler        | Vite 6                                                |
| Styling        | Tailwind CSS v4 + CSS custom properties               |
| State          | Zustand 5 (with Redux DevTools support)               |
| Forms          | react-hook-form 7                                     |
| Validation     | zod 4                                                 |
| i18n           | react-intl 10                                         |
| Icons          | lucide-react                                          |
| Fonts          | Geist, Funnel Sans, Inter (via Google Fonts)          |
| Tests          | vitest 4 + @testing-library/react + jsdom             |
| Catalog        | Storybook 10 (`@storybook/react-vite`)                |

## Project Structure

```
Problem2/
├── index.html
├── package.json
├── vite.config.ts                              # Vite + vitest config (jsdom env)
├── tsconfig.json                               # Path aliases: @, @lib, @shared, @test
├── .storybook/                                 # Storybook config (Tailwind, i18n, theme decorators)
│   ├── main.ts
│   ├── preview.tsx
│   └── preview-head.html                       # Mirrors index.html font links
└── src/
    ├── main.tsx                                # Entry point
    ├── App.tsx                                 # Root with IntlProvider
    ├── intl.ts                                 # Merges per-feature i18n maps
    ├── index.css                               # Theme tokens (light + dark) + dropdown keyframes
    │
    ├── lib/
    │   ├── zustand/
    │   │   └── createStore.ts                  # Zustand wrapper with action labels
    │   └── test/
    │       ├── setup.ts                        # jest-dom matchers + cleanup
    │       └── renderWithIntl.tsx              # Test helper (IntlProvider)
    │
    ├── features/
    │   ├── Layout/                             # Header, branding, global controls
    │   │   ├── components/
    │   │   │   ├── Header.tsx
    │   │   │   ├── Logo.tsx
    │   │   │   ├── LanguageSelector.tsx         # Animated dropdown via useDropdown
    │   │   │   ├── LanguageOption.tsx
    │   │   │   └── ThemeSwitcher.tsx
    │   │   ├── store/
    │   │   │   └── useGlobalStore.ts           # Language + theme state
    │   │   ├── data/
    │   │   │   └── languages.ts
    │   │   ├── intl/{en,zh,th}.json            # brand.* keys
    │   │   └── index.ts
    │   │
    │   ├── SwapToken/                          # Core swap logic & form
    │   │   ├── components/
    │   │   │   ├── SwapForm.tsx                # Orchestrator
    │   │   │   ├── SwapCardBody.tsx            # Front face: form + RHF Controller
    │   │   │   ├── SwapHeader.tsx
    │   │   │   ├── SwapInputCard.tsx           # From/To input shell + error display
    │   │   │   ├── SwapDirectionButton.tsx
    │   │   │   ├── SwapRateInfo.tsx
    │   │   │   ├── SwapActionButton.tsx
    │   │   │   ├── SwapFooter.tsx
    │   │   │   ├── SwapTokenSelectorOverlay.tsx
    │   │   │   └── TokenBadge.tsx
    │   │   ├── hooks/
    │   │   │   ├── useSwapForm.ts              # RHF + zod + store sync
    │   │   │   ├── useSwapAnimation.ts
    │   │   │   ├── useFlipHeight.ts
    │   │   │   └── usePriceFetcher.ts
    │   │   ├── store/
    │   │   │   └── useSwapStore.ts             # Swap state + live price fetching
    │   │   ├── data/
    │   │   │   └── tokens.ts                   # 32 tokens + fallback mock prices
    │   │   ├── types/
    │   │   │   └── token.ts
    │   │   ├── utils/
    │   │   │   └── amountValidation.ts         # sanitizeAmount + zod schema
    │   │   ├── intl/{en,zh,th}.json            # swap.* keys
    │   │   └── index.ts
    │   │
    │   ├── Settings/                           # Settings panel (slippage, network…)
    │   │   ├── components/
    │   │   │   ├── SettingsPanel.tsx           # Orchestrator
    │   │   │   ├── SettingsHeader.tsx
    │   │   │   ├── SectionHeader.tsx           # Label + click-to-show tooltip
    │   │   │   ├── Toggle.tsx
    │   │   │   ├── ToggleRow.tsx
    │   │   │   ├── SlippageSection.tsx
    │   │   │   ├── NetworkSection.tsx          # Animated dropdown via useDropdown
    │   │   │   ├── NetworkIcon.tsx
    │   │   │   ├── RefreshRateSection.tsx
    │   │   │   └── ApiEndpointSection.tsx
    │   │   ├── hooks/
    │   │   │   └── useTooltipPosition.ts       # Right → left → bottom fallback
    │   │   ├── data/{networks.ts,presets.ts}
    │   │   ├── utils/clipboard.ts
    │   │   ├── intl/{en,zh,th}.json            # settings.* keys
    │   │   └── index.ts
    │   │
    │   └── SelectToken/                        # Token picker modal
    │       ├── components/
    │       │   ├── TokenSelector.tsx
    │       │   ├── TokenSearchInput.tsx
    │       │   ├── TokenListSection.tsx
    │       │   └── TokenRow.tsx
    │       ├── hooks/
    │       │   └── useModalAnimation.ts
    │       ├── utils/filterTokens.ts
    │       ├── intl/{en,zh,th}.json            # tokenSelector.* keys
    │       └── index.ts
    │
    └── shared/
        ├── hooks/
        │   ├── useT.ts                         # Sugar over useIntl().formatMessage
        │   ├── useDropdown.ts                   # Animated dropdown (spring keyframes)
        │   ├── useEscapeKey.ts
        │   └── useClickOutside.ts
        └── utils/formatNumber.ts               # formatAmount, formatBalance
```

Tests are co-located next to source as `*.test.ts(x)`. Stories likewise as `*.stories.tsx`.

## Features

### Token Swap

- Select **from** and **to** tokens from a list of 32 (ETH, USDC, WBTC, SOL, …)
- Enter an amount; the converted output updates in real-time
- Exchange rate, USD equivalents, max slippage, and network fee displayed below
- Animated swap button with loading spinner (3 s feedback)
- Smart number formatting — small values like `0.00000123` display full precision instead of rounding to `0.00`

### Form Validation (react-hook-form + zod)

The "from amount" input is fully validated. `sanitizeAmount` runs on every keystroke and `buildAmountSchema(balance)` (a `z.string().superRefine(...)` early-exit chain) decides whether the value is acceptable.

| Behaviour                              | Outcome                                              |
| -------------------------------------- | ---------------------------------------------------- |
| Letters or symbols                     | Stripped on input — `abc1.5xyz` → `1.5`              |
| Multiple decimal points                | Collapsed — `1.5.7.9` → `1.579`                      |
| More than 18 decimal places            | Clamped to 18 (ERC-20 ceiling)                       |
| Leading zeros                          | Trimmed — `0001.5` → `1.5`                           |
| Empty input                            | "Enter an amount" + Swap button disabled             |
| Zero or negative                       | "Amount must be greater than 0" + button disabled    |
| Amount > selected token's balance      | "Insufficient {SYMBOL} balance" + button disabled    |
| Token switched (different balance)     | Re-validates automatically                           |

Errors surface as a red ring around the input + a `role="alert"` message below, and the **Swap Tokens** button is gated on `formState.isValid`.

### Live Price Fetching

- Prices pulled from [`https://interview.switcheo.com/prices.json`](https://interview.switcheo.com/prices.json)
- Auto-refreshes on a configurable interval (5 s / 10 s / 30 s / 60 s)
- Deduplicates API response, keeping the latest price per currency
- Spinning refresh icon during fetch (2 s)
- Falls back to bundled mock prices if the API is unreachable

### Settings Panel

- **Slippage tolerance** — presets (0.1%, 0.5%, 1.0%) or custom input
- **Network** — Ethereum, Polygon, BNB Chain, Optimism, Arbitrum (with gas estimates and animated dropdown)
- **Price refresh rate** — 5 s (default) / 10 s / 30 s / 60 s
- **API endpoint** — displayed with copy button
- Info icons (ⓘ) with click-to-show tooltips (positioned outside the card via React Portal)
- Card flip animation between swap form ↔ settings

### Token Selector

- Full-screen modal with backdrop blur
- Search by name or symbol
- Sections: "Most Used" + "Available"
- Scrollable list with fixed height
- Close on Esc key or backdrop click
- Enter/exit scale + fade animation

### Theme

- **Light** (default) and **Dark** mode
- Toggle via sun/moon switcher in header
- Implemented with CSS custom properties (`--s-*` tokens)
- `.dark` class on `<html>` overrides all swap variables
- Smooth 300 ms transition on all themed surfaces

### Internationalization (i18n)

- **3 languages**: English, Chinese (中文), Thai (ไทย)
- Dropdown selector in the header with flag emojis
- Powered by `react-intl` (ICU message format)
- 38 translation keys split across 4 feature slices, merged at the App level via `src/intl.ts`

## Theme Architecture

All component colors reference CSS custom properties defined in `index.css`:

```
:root {
  --s-card: #ffffff;
  --s-main: #E8F0ED;
  --s-btn:  #2D5E3A;
  --s-text: #1A2E22;
  /* … 20+ tokens */
}

.dark {
  --s-card: #162119;
  --s-main: #0D1510;
  --s-btn:  #2D5E3A;
  --s-text: #D4E8DC;
  /* … overrides */
}
```

Components use `bg-[var(--s-card)]`, `text-[var(--s-text)]`, etc. — no Tailwind `dark:` variants needed.

## State Management

Two Zustand stores, both created via a thin wrapper that adds action labels for Redux DevTools:

| Store             | Responsibility                                                    |
| ----------------- | ----------------------------------------------------------------- |
| `useGlobalStore`  | Language (`EN`/`ZH`/`TH`), theme (`light`/`dark`), `toggleTheme`  |
| `useSwapStore`    | Tokens, amounts, slippage, network, refresh rate, prices, fetching |

Price-related pure functions (`getToAmount`, `getUsdValue`) are exported alongside the store for use in components.

## Testing

Run with `bun run test` (single pass) or `bun run test:watch`.

- **166 tests across 39 files** covering pure utils, both stores, every shared/feature hook, every component, and an end-to-end validation flow integration test on `SwapCardBody`.
- Coverage (v8): **92.4 %** statements / **89.3 %** branches / **90.0 %** functions / **94.3 %** lines.
- Setup: `jsdom` environment, `@testing-library/jest-dom` matchers, automatic `cleanup()` between tests, and a `renderWithIntl()` helper (`@test/renderWithIntl`) that wraps the unit-under-test in `IntlProvider` with the merged English message map.
- The zod schema in `amountValidation.ts` is exercised directly (each issue's `message` is the i18n key) and indirectly through `useSwapForm`.

## Storybook

Run with `bun run storybook` (dev) or `bun run build-storybook` (static).

- 26 story files spanning all four feature slices — each component has at least one story; complex ones (`SwapInputCard`, `LanguageSelector`, `Toggle`, …) include multiple variants.
- The Tailwind v4 `@tailwindcss/vite` plugin is registered via `viteFinal` in `.storybook/main.ts` so utility classes compile correctly inside the Storybook iframe.
- A global `IntlProvider` decorator wraps every story; a toolbar locale switcher lets you flip stories between EN / ZH / TH.
- A light/dark toolbar (`@storybook/addon-themes`, toggling `.dark` on `<html>`) and matching background swatches preview both themes.
- `.storybook/preview-head.html` mirrors `index.html`'s Google Fonts links so typography matches the running app.

## Architectural Notes

- **Feature slice pattern.** Each feature (`Layout`, `SwapToken`, `Settings`, `SelectToken`) owns its own components, hooks, store, data, utils, and i18n. Cross-feature imports use relative paths to a sibling feature's barrel.
- **Path aliases.** `@` → `src/`, `@lib` → `src/lib/`, `@shared` → `src/shared/`, `@test` → `src/lib/test/` — configured in both `tsconfig.json` and `vite.config.ts`. No `../../../` imports anywhere.
- **One component per file.** Large flows like `SwapForm` and `SettingsPanel` are decomposed into small, individually testable components and hooks. The largest component file is currently ~85 lines.
- **Shared animated dropdown.** The `useDropdown` hook (`@shared/hooks/useDropdown`) provides spring-curve open/close animations with staggered item entrances via CSS `@keyframes`. Used by both `LanguageSelector` and `NetworkSection`.
- **Single source of truth for validation.** The `buildAmountSchema(balance)` zod schema is shared between `validateAmount()` (used in tests) and `useSwapForm`'s react-hook-form rules — there is no duplicate `if/else` validation anywhere.
- **No Tailwind `dark:` variants.** Theming flows entirely through the `--s-*` CSS custom properties, so a single `.dark` class on `<html>` flips every themed surface at once.
