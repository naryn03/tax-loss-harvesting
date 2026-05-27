# KoinX — Tax Loss Harvesting Tool

A responsive React application for visualising and optimising capital gains tax liability through tax loss harvesting.

## Features

- **Pre vs After Harvesting** cards with real-time updates
- **Holdings table** with sortable, selectable rows (individual & bulk)
- **Auto-computed savings** banner when harvesting reduces tax liability
- **View All** toggle for the full holdings list
- **Loading skeletons** while mock APIs resolve
- **Mobile-responsive** layout
- **Dark theme** with accent color system

## Setup & Running

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build → ./dist
npm run preview   # preview production build
```

## Tech Stack

- **React 18** (hooks, context)
- **Vite** for bundling
- **Plain CSS** with CSS variables (no framework dependency)
- **Mock APIs** via in-memory Promises (no server needed)
- **Google Fonts** — Syne (display) + DM Sans (body)

## Business Logic

### Pre-Harvesting
Directly from the Capital Gains API:
- `Net ST = stcg.profits − stcg.losses`
- `Net LT = ltcg.profits − ltcg.losses`
- `Realised = Net ST + Net LT`

### After Harvesting
For each **selected** holding:
- If `stcg.gain > 0` → add to `stcg.profits`
- If `stcg.gain < 0` → add absolute value to `stcg.losses`
- Same logic for `ltcg.gain`

### Savings Banner
Shown only when: `Pre-Harvesting Realised > Post-Harvesting Realised`

## Assumptions

1. Holdings with negligible gains (< ₹0.001) are still shown but won't meaningfully affect the totals.
2. The "Amount to Sell" column populates with `totalHolding` when a row is selected, as per spec.
3. Holdings are sorted by absolute STCG gain descending (most impactful first).
4. Duplicate coin symbols (e.g. two USDC entries) are treated as separate holdings.
