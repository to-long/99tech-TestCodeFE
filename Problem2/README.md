# Problem 2 — Swap Token Interface

A single-page token swap interface built with **React 19**, **TypeScript 5.8**, **Vite 6**, **Tailwind CSS v4**, and **Zustand 5**. Users can swap between 32 tokens with live exchange rates fetched from a remote API.

## Quick Start

```bash
cd Problem2
bun install
bun run dev      # http://localhost:5173
```

| Script             | Description                          |
| ------------------ | ------------------------------------ |
| `bun run dev`      | Start Vite dev server with HMR       |
| `bun run build`    | Type-check + production build         |
| `bun run preview`  | Preview the production build locally  |

## Tech Stack

| Layer          | Technology                                      |
| -------------- | ----------------------------------------------- |
| Runtime        | Bun                                             |
| Framework      | React 19 + TypeScript 5.8                       |
| Bundler        | Vite 6                                          |
| Styling        | Tailwind CSS v4 + CSS custom properties         |
| State          | Zustand 5 (with Redux DevTools support)         |
| i18n           | react-intl 10                                   |
| Icons          | lucide-react                                    |
| Fonts          | Geist, Funnel Sans, Inter (via Google Fonts)    |

## Project Structure

```
Problem2/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
└── src/
    ├── main.tsx                                # Entry point
    ├── App.tsx                                 # Root with IntlProvider
    ├── index.css                               # Theme tokens (light + dark)
    │
    ├── features/
    │   ├── Layout/                             # Header, branding, global controls
    │   │   ├── components/
    │   │   │   ├── Header.tsx
    │   │   │   ├── Logo.tsx
    │   │   │   ├── LanguageSelector.tsx
    │   │   │   └── ThemeSwitcher.tsx
    │   │   ├── store/
    │   │   │   └── useGlobalStore.ts           # Language + theme state
    │   │   ├── intl/
    │   │   │   ├── en.json                     # brand.* keys
    │   │   │   ├── zh.json
    │   │   │   └── th.json
    │   │   └── index.ts
    │   │
    │   ├── SwapToken/                          # Core swap logic & form
    │   │   ├── components/
    │   │   │   └── SwapForm.tsx
    │   │   ├── store/
    │   │   │   └── useSwapStore.ts             # Swap state + live price fetching
    │   │   ├── data/
    │   │   │   └── tokens.ts                   # 32 tokens + fallback mock prices
    │   │   ├── types/
    │   │   │   └── token.ts
    │   │   ├── intl/
    │   │   │   ├── en.json                     # swap.* keys
    │   │   │   ├── zh.json
    │   │   │   └── th.json
    │   │   └── index.ts
    │   │
    │   ├── Settings/                           # Settings panel (slippage, network…)
    │   │   ├── components/
    │   │   │   └── SettingsPanel.tsx
    │   │   ├── intl/
    │   │   │   ├── en.json                     # settings.* keys
    │   │   │   ├── zh.json
    │   │   │   └── th.json
    │   │   └── index.ts
    │   │
    │   └── SelectToken/                        # Token picker modal
    │       ├── components/
    │       │   └── TokenSelector.tsx
    │       ├── intl/
    │       │   ├── en.json                     # tokenSelector.* keys
    │       │   ├── zh.json
    │       │   └── th.json
    │       └── index.ts
    │
    └── shared/
        └── lib/zustand/
            └── createStore.ts                  # Zustand wrapper with action labels
```

## Features

### Token Swap

- Select **from** and **to** tokens from a list of 32 (ETH, USDC, WBTC, SOL, …)
- Enter an amount; the converted output updates in real-time
- Exchange rate, USD equivalents, max slippage, and network fee displayed below
- Animated swap button with loading spinner (3 s feedback)
- Smart number formatting — small values like `0.00000123` display full precision instead of rounding to `0.00`

### Live Price Fetching

- Prices pulled from [`https://interview.switcheo.com/prices.json`](https://interview.switcheo.com/prices.json)
- Auto-refreshes on a configurable interval (5 s / 10 s / 30 s / 60 s)
- Deduplicates API response, keeping the latest price per currency
- Spinning refresh icon during fetch (2 s)
- Falls back to bundled mock prices if the API is unreachable

### Settings Panel

- **Slippage tolerance** — presets (0.1%, 0.5%, 1.0%) or custom input
- **Transaction deadline** — revert window in minutes
- **Network** — Ethereum, Polygon, BNB Chain, Optimism, Arbitrum (with gas estimates)
- **Price refresh rate** — 5 s / 10 s / 30 s / 60 s
- **API endpoint** — displayed with copy button
- **Expert mode** — allow high-slippage trades
- **Multi-hop trades** — route through multiple pools
- Info icons (ⓘ) with click-to-show tooltips (positioned outside the card)
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
- 33 translation keys split across 4 feature slices, merged at App level

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
| `useGlobalStore`  | Language (`EN`/`ZH`/`TH`), theme (`light`/`dark`), `toggleTheme` |
| `useSwapStore`    | Tokens, amounts, slippage, deadline, network, prices, fetching    |

Price-related pure functions (`getToAmount`, `getUsdValue`) are exported alongside the store for use in components.
