# 99Tech Frontend Coding Test

Three independent submissions, one per directory. Each problem has its own README with the full write-up — this file is just a top-level index.

| # | Folder                       | What it is                                                  | Stack                            |
| - | ---------------------------- | ----------------------------------------------------------- | -------------------------------- |
| 1 | [`Problem1/`](./Problem1)    | Three implementations of `sum_to_n(n)` with a CLI runner    | Plain Node.js                    |
| 2 | [`Problem2/`](./Problem2)    | A token-swap SPA with form validation, tests, and Storybook | React 19 · Vite 6 · Tailwind v4  |
| 3 | [`Problem3/`](./Problem3)    | Code review + refactor of a `WalletPage` React component    | React + TypeScript               |

Each subdirectory is self-contained — install and run from inside it.

---

## Problem 1 — `sum_to_n`

Three approaches: arithmetic-series formula, iterative loop, recursion. CLI dispatch + `module.exports`.

```bash
cd Problem1
npm start -- formula 5      # → 15
npm start -- loop 5         # → 15
npm start -- recursive 5    # → 15
```

Full write-up: [`Problem1/README.md`](./Problem1/README.md).

---

## Problem 2 — Swap Token Interface

A single-page token-swap UI with:

- 32 supported tokens, live prices fetched on a configurable interval (5 / 10 / 30 / 60 s)
- **react-hook-form + zod** validation on the swap-amount input (sanitization, ≤ balance, ≤ 18 decimals, etc.)
- 3-language i18n (EN / ZH / TH) split across feature slices
- Light / dark theme via CSS custom properties
- 162 vitest unit tests, **94 % line coverage**
- Storybook 10 catalog (`bun run storybook`)
- Responsive down to a 320 px viewport

```bash
cd Problem2
bun install
bun run dev               # http://localhost:5173
bun run test              # vitest
bun run storybook         # http://localhost:6006
bun run build             # type-check + production build
```

Full write-up: [`Problem2/README.md`](./Problem2/README.md).

---

## Problem 3 — `WalletPage` review

Read the original code, list every bug + anti-pattern, and ship a cleaned-up version. The refactored file uses inline comments to document each fix (left in deliberately for the reviewer).

| File                 | Purpose                                                   |
| -------------------- | --------------------------------------------------------- |
| `original.tsx`       | The original, with bugs + anti-patterns intact            |
| `refactor.tsx`       | Cleaned-up version, with `// why` comments per change     |
| `README.md`          | The full review — 7 bugs, 7 anti-patterns                 |

Full write-up: [`Problem3/README.md`](./Problem3/README.md).

---

## Repo conventions

- Per-problem isolation: each folder has its own `package.json`, lockfile (Problem 2), and tooling. No workspace, no shared deps — keeps each submission reviewable on its own.
- `.gitignore` at the root covers all three (build outputs, lockfile artefacts, editor folders, `coverage/`, `storybook-static/`, etc.).
- Commits are small, scoped, and follow the conventional-commit style (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `build`).
