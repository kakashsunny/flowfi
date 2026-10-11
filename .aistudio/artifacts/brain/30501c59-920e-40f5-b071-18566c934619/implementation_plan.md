# FlowFi — Gen Z Personal Finance & Ripple-Effect Simulator

FlowFi is an ultra-responsive personal finance web application built for Gen Z, centering on an interactive ₹10,000 / 30-day budget challenge where every financial action—logging an expense, locking savings, or adding a subscription—instantly calculates and previews ripple effects across available balance, daily allowance, risk, and 30-day trajectory before confirmation.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been confirmed and integrated into this blueprint:

- **Initial State Preset**: Initialized with an authentic **Day 10 scenario** (₹10,000 total budget, ₹2,000 spent, ₹1,000 committed subscriptions, ₹500 locked in savings goals, ₹325/day allowance, 20 days remaining) alongside a one-click "Reset / Fresh Start" action.
- **Visual Aesthetic**: Sleek **Obsidian Dark Mode** (`#090A0F` base canvas, `#121522` elevated cards, `#1B2035` hairline borders) energized with electric emerald (`#10B981`) safe tones, vibrant indigo/violet (`#6366F1`) action accents, amber (`#F59E0B`) caution states, and ruby (`#EF4444`) danger thresholds.
- **Decision Simulator Modes**: Full dual-mode simulator featuring both granular custom expense/amount sliders and instant Gen Z one-tap scenarios (*"Weekend Getaway ₹2,400"*, *"Sneaker Drop ₹3,500"*, *"Swiggy Midnight Binge ₹650"*, *"Concert Pass ₹1,800"*).
- **Navigation Architecture**: Full-featured single-page application with lightning-fast tabbed routing supporting all specified views: **Dashboard (`/`)**, **Decision Simulator (`/simulate`)**, **Savings Goals (`/goals`)**, **Subscriptions (`/subscriptions`)**, and **30-Day Forecast (`/forecast`)**.

---

### 1. Overview & Core Concept

FlowFi tackles the psychological gap between spending money today and running out of cash two weeks later. Instead of passive retrospective expense trackers, FlowFi is built around **forward-looking simulation**:
- **Fixed 30-Day Cycle**: Users navigate a ₹10,000 monthly pool where ₹1 spent today directly slashes tomorrow's daily spending capacity.
- **The Ripple Effect Engine**: Before a purchase is finalized, users see exactly how it impacts their daily allowance, risk category, financial health score, and goal completion dates.
- **Deterministic Math**: Pure client-side calculations (`safeAdd`, `safeSub`, floating-point guards, zero negative balance floor) running in sub-5ms latency for lag-free slider interactions.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **The Hero Pulse (Dashboard)**:
   - Dynamic SVG Budget Ring visualizing total spent vs. committed vs. available funds.
   - Hero balance card showing Available Balance (`₹6,500`), Days Remaining (`20`), and Daily Allowance (`₹325/day`).
   - Financial Health Gauge (0–100) and three-state Risk Meter (Safe $\ge ₹200$/day, Caution $₹100$–$₹199$/day, Danger $< ₹100$/day).
   - Category spending breakdown and calendar activity heatmap.
2. **What-If Simulation Lab (`/simulate`)**:
   - Interactive scratchpad where users type an amount or tap Gen Z presets.
   - Instant Side-by-Side Impact Preview comparing "Current" vs. "Simulated" balance, daily allowance, risk, and 30-day forecast line.
   - Ripple Consequence list (e.g. *"Daily spending drops from ₹325 to ₹225"*, *"Goal 'Goa Trip' delayed by 4 days"*).
   - "Commit Expense" button that moves the simulated item into real ledger state with double-submit prevention.
3. **Savings Lockbox (`/goals`)**:
   - Target goals with visual progress bars, required daily savings calculation, and on-track status indicators.
   - Quick goal funding action that locks money from available balance into goals.
4. **Subscription Radar (`/subscriptions`)**:
   - Monthly commitments calendar showing upcoming billing dates, auto-calculating total committed budget.
5. **30-Day Trajectory (`/forecast`)**:
   - Interactive SVG line forecast projecting end-of-month balance under current spending velocity vs. simulated shock scenarios.

#### Design System & Typography
- **Canvas & Surfaces**: Deep obsidian `#090A0F`, surface cards `#121522`, border hairlines `#1E2337`.
- **Typography**: Clean display sans paired with monospace tabular numerals (`tabular-nums font-mono`) for zero-jitter financial metrics.
- **Zero-Pill Discipline**: Metadata displayed with clean unboxed text and typographic dots (`·`), avoiding cluttered badge sandwiches.
- **Accessibility**: Full WCAG AA contrast compliance, screen-reader descriptions for all charts and meters, skip navigation link, and high-visibility keyboard focus rings (`focus-visible:ring-2 focus-visible:ring-indigo-500`).

---

### 3. Key Product Decisions & Trade-Offs

1. **State Persistence**:
   - *Chosen Approach*: Resilient versioned `localStorage` with Zod schema validation and graceful in-memory fallback.
   - *Why*: Instant load times, zero login barriers, and offline-first reliability.
2. **Deterministic Simulation Engine**:
   - *Chosen Approach*: Synchronous pure mathematical functions without external API overhead.
   - *Why*: Ensures sub-5ms recalculations on every keystroke and slider drag, delivering 60fps responsiveness.
3. **Floating Point Safety**:
   - *Chosen Approach*: Explicit `safeAdd` and `safeSub` routines rounding to 2 decimal places and clamping negative balance at ₹0.
   - *Why*: Prevents subtle JavaScript rounding anomalies (`0.1 + 0.2 === 0.30000000000000004`) in financial arithmetic.
4. **Input Protection**:
   - *Chosen Approach*: Full Zod validation on expenses, goals, and subscriptions with strict limits (max ₹10,000, regex sanitization, positive non-zero constraints).

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FlowFi App                                │
│                                                                        │
│  ┌─────────────────────── Top Bar Navigation ───────────────────────┐  │
│  │  FlowFi Wordmark   ·   Dashboard  Simulate  Goals  Subs  Forecast│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│  ┌───────────────────────── View Router ────────────────────────────┐  │
│  │                                                                  │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │  │
│  │  │  Dashboard   │ │  Simulator   │ │    Goals     │ │Forecast  │ │  │
│  │  │  (Ring/Hero) │ │(What-If/Diff)│ │(Targets/Lock)│ │ (30-Day) │ │  │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └────┬─────┘ │  │
│  └─────────┼────────────────┼────────────────┼──────────────┼───────┘  │
│            ▼                ▼                ▼              ▼          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                      Zustand Budget Store                        │  │
│  │   • totalBudget: ₹10,000     • spent: ₹2,000                     │  │
│  │   • committed: ₹1,000        • savedToGoals: ₹500                │  │
│  │   • availableBalance: ₹6,500 • dailyAllowance: ₹325              │  │
│  │   • expenses[] · goals[] · subscriptions[]                       │  │
│  └──────────────────┬────────────────────────┬──────────────────────┘  │
│                     │                        │                         │
│                     ▼                        ▼                         │
│  ┌─────────────────────────────┐   ┌────────────────────────────────┐  │
│  │     Calculation Engines     │   │      Storage & Security        │  │
│  │ • budget-engine.ts          │   │ • Zod Schemas (validators.ts)  │  │
│  │ • simulator-engine.ts       │   │ • Versioned LocalStorage       │  │
│  │ • health-calculator.ts      │   │ • Double-Submit Protection     │  │
│  │ • forecast-engine.ts        │   │ • safeAdd / safeSub Floats     │  │
│  └─────────────────────────────┘   └────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

#### Verification & Test Strategy
- Unit tests covering `budget-engine`, `simulator-engine`, and `validators` verifying all mathematical invariants:
  - Exact available balance and daily allowance formulas.
  - Risk thresholds (`safe` $\ge 200$, `caution` $100$–$199$, `danger` $< 100$).
  - Clamping negative balances at 0.
  - Health score bounded within [0, 100].
  - Simulator pure-function idempotence.
- Linting and TypeScript compilation checks ensuring zero errors.
