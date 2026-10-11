<div align="center">

# ⚡ FlowFi
### The World's First Predictive Personal Finance Simulator for Gen Z

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-443e38?style=for-the-badge)](https://zustand.docs.pmnd.rs/)
[![Zod](https://img.shields.io/badge/Validation-Zod-3068b7?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)
[![Vitest](https://img.shields.io/badge/Tested_with-Vitest-FCC72B?style=for-the-badge&logo=vitest&logoColor=black)](https://vitest.dev/)
[![Accessibility](https://img.shields.io/badge/A11y-WCAG_AA-10B981?style=for-the-badge)](https://www.w3.org/WAI/standards-guidelines/wcag/)

<p align="center">
  <strong>Stop reviewing mistakes after they happen. Simulate the ripple before you tap.</strong><br/>
  FlowFi reimagines personal finance as an ultra-responsive forward-looking simulation engine.<br/>
  Every purchase, goal deposit, and subscription instantly recalculates your 30-day runway in real-time.
</p>

[Explore Key Features](#-key-features) · [Mathematical Specifications](#-mathematical-invariants--calculation-engine) · [Architecture](#-system-architecture) · [Security & Validation](#-security--data-integrity) · [Test Suite](#-test-suite--verification)

---

</div>

## 🌟 The FlowFi Paradigm: Why Traditional Budgeting Fails

| Traditional Expense Trackers | FlowFi Ripple-Effect Engine |
| :--- | :--- |
| **Passive & Retrospective**: Logs where money *went* after it's gone | **Active & Predictive**: Simulates where money *will go* before you spend |
| **Vague Monthly Buckets**: "₹2,500 left for dining this month" | **Exact Daily Velocity**: "Spending ₹650 tonight reduces your runway to ₹182/day" |
| **Isolated Transactions**: Purchases feel disconnected from future bills | **Cascading Ripple Chains**: Shows how an impulse buy delays your trip goal by 4 days |
| **Anxiety-Inducing Spreadsheets**: Complex tables that feel like homework | **Instant Gen Z Feedback**: Sub-5ms calculations with one-tap real-world presets |

---

## ⚡ Key Features

### 1. 🎯 Dynamic ₹10,000 / 30-Day Budget Engine
- **Strict Monthly Pool**: Users navigate a fixed ₹10,000 cycle across 30 calendar days.
- **Available Runway Balance**: Transparently separates total balance from funds locked in savings goals and committed recurring subscriptions.
- **Speedometer Daily Allowance**: Continuously adjusts `₹X/day` based on exact remaining cycle days, ensuring users never unknowingly run dry.

### 2. 🔮 Instant "What-If" Decision Simulator (`/simulate`)
- **Sub-5ms Pure Mathematical Engine**: Drag the amount scrubber or type an expense to instantly preview cascading consequences before confirming.
- **One-Tap Gen Z Presets**:
  - 🍔 *Midnight Munchies* (₹650)
  - 🎟️ *Sunburn Music Fest Pass* (₹1,800)
  - 👟 *Limited Sneaker Drop* (₹3,500)
  - 🚗 *Lonavala Weekend Getaway* (₹2,400)
  - 💪 *Gym & Protein Stack* (₹1,200)
  - ⚡ *Dev Pro Subscriptions* (₹1,500)
- **Before/After Impact Diff**: Live side-by-side comparison of Available Balance, Daily Allowance, Risk Assessment, and Health Score.
- **Smart Recommendations**: Rule-based contextual coaching advising whether to commit, postpone, or adjust.

### 3. 🛡️ Three-Stage Velocity Risk Meter
- 🟢 **Safe** (`≥ ₹200/day`): Sustainable runway with full flexibility.
- 🟡 **Caution** (`₹100` – `₹199/day`): Pacing alert requiring non-essential spending restraint.
- 🔴 **Danger** (`< ₹100/day`): High alert warning of imminent overdraft before the cycle concludes.

### 4. 📈 0–100 Weighted Financial Health Gauge
- Evaluates real financial discipline using a calibrated weighted algorithm:
  - **Savings Rate** (30% weight)
  - **Spending Pacing** (25% weight)
  - **Daily Consistency** (20% weight)
  - **Goals on Track** (15% weight)
  - **Risk Velocity Score** (10% weight)

### 5. 🔒 Savings Goals & Shielded Lockbox (`/goals`)
- Create milestone goals (*"Goa Trip"*, *"Hot-Swap Mechanical Keyboard"*).
- Funds committed to goals are immediately locked and deducted from the available daily pool.
- Auto-calculates required daily contributions and predicts target completion dates.

### 6. 📡 Recurring Subscriptions Radar (`/subscriptions`)
- Tracks recurring monthly OTT, fitness, and software memberships (Spotify, Netflix, GitHub Copilot).
- Protects committed funds so upcoming auto-debits never bounce.
- One-click active/paused state toggling.

### 7. 📊 30-Day Trajectory Forecast (`/forecast`)
- High-fidelity interactive SVG chart plotting actual historical burn alongside projected balance curves.
- Detects scheduled subscription charges on their exact cycle dates.
- Weekly milestone summaries (Week 1, Mid-Cycle, Week 3, Month Close).

---

## 📐 Mathematical Invariants & Calculation Engine

FlowFi enforces strict financial invariants to eliminate floating-point drift and guarantee reliable numbers:

### 1. Available Runway Formula
```math
\text{Available Balance} = \max\left(0, \text{Total Budget} - (\text{Spent} + \text{Committed} + \text{SavedToGoals})\right)
```

### 2. Dynamic Daily Allowance Formula
```math
\text{Daily Allowance} = \frac{\text{Available Balance}}{\max(\text{Days Remaining}, 1)}
```

### 3. Risk Thresholds
```typescript
riskLevel = dailyAllowance < 100 ? 'danger' 
          : dailyAllowance < 200 ? 'caution' 
          : 'safe';
```

### 4. Financial Health Score Algorithm
```typescript
healthScore = Math.round(
  (savingsRate * 30 +
   spendingRate * 25 +
   consistencyScore * 20 +
   goalsOnTrack * 15 +
   riskScore * 10) / 100
);
```

### 5. Floating-Point Precision Protection
All arithmetic is passed through two dedicated utility guards:
```typescript
// Prevent 0.1 + 0.2 = 0.30000000000000004
export function safeAdd(a: number, b: number): number {
  return Math.round((a + b) * 100) / 100;
}

export function safeSub(a: number, b: number): number {
  return Math.max(0, Math.round((a - b) * 100) / 100);
}
```

---

## 🏗️ System Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FlowFi Client                             │
│                                                                        │
│  ┌─────────────────────── Top Bar Contract ─────────────────────────┐  │
│  │  ⚡ FlowFi Wordmark  ·   Dashboard  Simulate  Goals  Subs  Forecast│  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                    │                                   │
│  ┌─────────────────────── View Routing Layer ───────────────────────┐  │
│  │                                                                  │  │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │  │
│  │  │  Dashboard   │ │  Simulator   │ │    Goals     │ │Forecast  │ │  │
│  │  │ (Ring/Hero)  │ │(What-If/Diff)│ │(Targets/Lock)│ │ (30-Day) │ │  │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └────┬─────┘ │  │
│  └─────────┼────────────────┼────────────────┼──────────────┼───────┘  │
│            ▼                ▼                ▼              ▼          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                   Zustand Global State Store                     │  │
│  │  • totalBudget: ₹10,000      • spent: ₹2,000                     │  │
│  │  • committed: ₹1,000         • savedToGoals: ₹500                │  │
│  │  • availableBalance: ₹6,500  • dailyAllowance: ₹325              │  │
│  │  • expenses[] · goals[] · subscriptions[]                        │  │
│  └──────────────────┬────────────────────────┬──────────────────────┘  │
│                     │                        │                         │
│                     ▼                        ▼                         │
│  ┌─────────────────────────────┐   ┌────────────────────────────────┐  │
│  │     Calculation Engines     │   │      Security & Persistence    │  │
│  │ • budget-engine.ts          │   │ • Zod Schemas (validators.ts)  │  │
│  │ • simulator-engine.ts       │   │ • Versioned LocalStorage       │  │
│  │ • health-calculator.ts      │   │ • Double-Submit Mitigation     │  │
│  │ • forecast-engine.ts        │   │ • Zero Negative Floor Guards   │  │
│  └─────────────────────────────┘   └────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security & Data Integrity

1. **Zero External Data Leaks**: Pure client-side execution. Zero user financial data or PII leaves the browser.
2. **Comprehensive Zod Validation**: Every user input is parsed and sanitized against strict schemas:
   - Amounts bounded to `₹1` – `₹10,000` with maximum 2 decimal places.
   - Cross-Site Scripting (XSS) mitigated through regex description sanitization.
   - Future dates blocked on expense logging.
3. **Resilient Versioned LocalStorage**:
   - Schema version validation (`STORAGE_VERSION = '1.0'`).
   - Graceful fallback to fresh in-memory state on corrupted storage payload.
4. **Form Double-Submit Protection**:
   - `isSubmitting` reactive locking across all transaction, goal, and subscription modals.

---

## ♿ Accessibility (WCAG AA Compliance)

- **Skip Navigation**: Keyboard and screen-reader shortcut `<a href="#main-content">` accessible on first `Tab`.
- **Accessible State Announcements**:
  - Live announcements (`aria-live="polite"`, `aria-atomic="true"`) for simulation results and risk updates.
  - Semantic `<div role="meter">` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for Health Score.
  - `<div role="status">` and `<div role="alert">` for critical risk and runway warnings.
- **Screen-Reader Tables**: All SVG charts and circular meters provide hidden, tabular alternative structures.
- **Color-Blind Resilient**: Status states always combine semantic color with descriptive icons and clear typography.
- **High-Contrast Focus Rings**: Global `*:focus-visible` styling (`outline: 2px solid #6366f1`).

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx                  # Top Bar Contract, skip link, responsive tabs
│   ├── page.tsx                    # Dashboard (Hero balance, ring, meters, ledger)
│   ├── simulate/page.tsx           # What-If decision simulator view
│   ├── goals/page.tsx              # Savings goals and lockbox view
│   ├── subscriptions/page.tsx      # Recurring commitments view
│   └── forecast/page.tsx           # 30-day runway projection view
├── components/
│   ├── ui/                         # Button, Card, Badge, Slider, Modal
│   ├── budget/
│   │   ├── BalanceCard.tsx         # Hero balance card (accessibility region)
│   │   ├── BudgetRing.tsx          # SVG animated allocation donut
│   │   ├── DailyAllowance.tsx      # ₹X/day remaining display & pacer
│   │   ├── SpendingBreakdown.tsx   # Category breakdown with screen-reader table
│   │   └── AddExpenseModal.tsx     # Zod-validated expense logging modal
│   ├── simulator/
│   │   ├── Simulator.tsx           # Standalone modular simulator container
│   │   ├── DecisionCard.tsx        # Scratchpad with Gen Z one-tap presets
│   │   ├── ImpactPreview.tsx       # Side-by-side Before/After diff card
│   │   └── ConsequenceList.tsx     # Cascading ripple effects breakdown
│   ├── health/
│   │   ├── HealthScore.tsx         # 0-100 financial health meter gauge
│   │   ├── RiskMeter.tsx           # Safe / Caution / Danger 3-stage indicator
│   │   └── HealthTips.tsx          # Actionable AI-style coaching advice
│   ├── goals/
│   │   ├── GoalCard.tsx            # Goal progress card with deposit trigger
│   │   ├── GoalProgress.tsx        # Aggregate lockbox summary
│   │   ├── GoalSimulator.tsx       # Savings lock ripple simulator
│   │   └── AddGoalModal.tsx        # Goal creation modal
│   ├── subscriptions/
│   │   └── AddSubscriptionModal.tsx# Subscription modal
│   └── charts/
│       ├── ForecastLine.tsx        # 30-day SVG trajectory curve
│       ├── SpendingHeatmap.tsx     # 30-day calendar spending matrix
│       └── CategoryPie.tsx         # Accessible spending donut chart
├── hooks/
│   ├── useBudget.ts                # Memoized category metrics and store actions
│   ├── useSimulator.ts             # Instant pure simulation hook
│   ├── useHealthScore.ts           # Real-time health scoring & tips
│   ├── useGoals.ts                 # Savings goals management hook
│   └── useSubscriptions.ts        # Subscriptions management hook
├── lib/
│   ├── budget-engine.ts            # safeAdd, safeSub, balance, daily allowance math
│   ├── simulator-engine.ts         # Pure mathematical What-If simulation engine
│   ├── health-calculator.ts        # Weighted health and risk scoring algorithms
│   ├── forecast-engine.ts          # 30-day balance trajectory generation
│   ├── storage.ts                  # Versioned localStorage with Zod validation
│   └── validators.ts               # Strict Zod input schemas
├── types/
│   └── index.ts                    # Core TypeScript domain definitions
├── constants/
│   └── categories.ts               # Expense categories, icons, colors & presets
└── store/
    └── budgetStore.ts              # Zustand atomic state store with persistence
```

---

## 🧪 Test Suite & Verification

FlowFi is backed by a comprehensive unit and component test suite using **Vitest** and **React Testing Library**:

```bash
# Run all unit and integration tests
npm test

# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build
```

### Verified Test Suites (19 Passed / 100% Green)
- **`budget-engine.test.ts`**: Verifies exact balance formulas, daily allowance division, risk thresholds, zero negative floor, and health score bounds.
- **`simulator-engine.test.ts`**: Verifies pure function idempotence, balance delta math, large amount danger alerts, and over-budget rejection.
- **`validators.test.ts`**: Verifies rejection of negative amounts, exceeding ₹10,000 limits, future dates, and whitespace sanitization.
- **`BalanceCard.test.tsx`**: Verifies currency rendering, screen-reader text, daily allowance display, and dynamic danger color classes.
- **`Simulator.test.tsx`**: Verifies real-time DOM balance updating on keystroke and `role="alert"` display on large entries.

---

## 🚀 Quickstart & Development

### Prerequisites
- Node.js 18+
- npm 9+

### Installation & Launch
```bash
# Clone the repository
git clone https://github.com/your-username/flowfi.git
cd flowfi

# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev
```

Visit `http://localhost:3000` to launch FlowFi.

---

## 🎨 Design Philosophy & Aesthetics

FlowFi follows the **Universal Frontend Design Constitution**:
- **Obsidian Dark Surface Palette**: Clean `#090A0F` canvas, `#111320` elevated cards, and `#1E2238` hairline borders.
- **Tabular Monospace Numerals**: Every rupee value, count, and date is locked to `tabular-nums font-mono` to prevent typographic jitter during live slider scrubbing.
- **Zero-Pill Discipline**: Metadata is presented through quiet unboxed typography and subtle separators (`·`), avoiding cluttered badge sandwiches.
- **Top Bar Contract**: Strict 3-zone header layout with single-line controls and zero wrapped labels.

---

<div align="center">
  <sub>Built with precision for the next generation of financial mastery.</sub><br/>
  <strong>FlowFi © 2026. Master your runway.</strong>
</div>
