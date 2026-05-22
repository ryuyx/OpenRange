# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server
npm run build     # Type-check (tsc -b) then bundle (vite build) → dist/
npm run lint      # ESLint on all files
npm run preview   # Preview the production build locally
```

No test runner is configured yet.

## Architecture

OpenRange is a GTO Texas Hold'em preflop opening range reference. Two-screen React SPA: a landing page for selecting table size / stack depth, then a range viewer with per-position 13×13 hand grids.

**Stack:** React 19, TypeScript 6, Vite 8, Tailwind CSS v4, shadcn/ui (base-ui/react primitives — not Radix).

**Path alias:** `@/` → `src/` (configured in both `vite.config.ts` and `tsconfig.app.json`).

### Data layer (`src/data/hands.ts`)

The single source of truth. Exports:
- `RANKS` — the 13 ranks A..2 in order.
- `GRID` — a 13×13 `GridHand[][]` (upper triangle = suited, diagonal = pairs, lower triangle = offsuit). Each hand has `id` (canonical label like `"AKs"`), `type`, `comboCount`, and `row`/`col` position.
- `ALL_HANDS` — deduplicated flat list (169 unique hands).
- `TOTAL_COMBOS` — 1326 total combos.
- `parseRange(range)` — parses a range notation string (e.g. `"88+, A2s+, KTo+"`) into a `Set<string>` of hand IDs. Supports `+` (plus) for pairs, suited, and offsuit.
- `comboCount()` / `percentage()` — compute stats from a hand ID set.
- `CONFIGS` — declarative table-size/stack-depth configs with per-position range strings. Currently: 6max (50/100/150 BB) and 9max (100 BB).
- `COMPUTED_CONFIGS` — pre-computed version of CONFIGS with parsed `hands: Set<string>`, `combos`, and `pct` for each position.

### Component tree

```
App (state machine: config | null)
├── Landing (players + stack depth selection)
│   - Dynamic options derived from CONFIGS
│   - Calls onEnter(config) to transition
└── RangeViewer (config: ComputedConfig)
    ├── Position tab bar (LJ/HJ/CO/BTN/SB etc.)
    ├── Stats row (combo count, range %)
    └── RangeTable (activeHands: Set<string>)
        - 13×13 <table> with TooltipProvider
        - Color: amber=pairs, sky=suited, rose=offsuit (muted if not in range)
```

### UI components (`src/components/ui/`)

shadcn/ui components built on `@base-ui/react` (a lower-level headless UI library from the Radix team, used as an alternative to Radix primitives). Currently: Button, Select, Tooltip. The `cn()` helper in `src/lib/utils.ts` merges Tailwind classes with `clsx` + `tailwind-merge`.

### Styling

Tailwind CSS v4 with the Vite plugin (`@tailwindcss/vite`). CSS custom properties for light/dark themes defined in `src/index.css` using oklch colors. shadcn base-nova style. Font: Geist Variable via `@fontsource-variable/geist`.

### TypeScript config

- `verbatimModuleSyntax` is on — imports of type-only symbols must use `import type`.
- `erasableSyntaxOnly` is on (TS 6.0) — no enums, no `namespace`s, no `constructor` parameter properties.
- `noUnusedLocals` / `noUnusedParameters` are on.
