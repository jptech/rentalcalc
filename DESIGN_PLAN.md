# 🏡 Rental Property Calculator - Design Plan

## Executive Summary

Building a comprehensive rental property analysis tool with React/Tailwind, focusing on exceptional UX, clear insights, and maintainable architecture. Emphasis on simplicity, beautiful design, and iterative development.

---

## 🎯 Core Philosophy

**Progressive Disclosure**: Guide users through complexity without overwhelming them
**Insight-First**: Surface key decisions and recommendations prominently
**Mobile-First**: Rental investors check properties on-the-go
**Simplicity**: Use React's built-in features, avoid over-engineering
**Beauty**: Professional, modern, engaging interface throughout

---

## 🏗️ Architecture

### Tech Stack
```
├── React 18+ (useState, useReducer, useContext, useMemo)
├── TypeScript (type safety for financial calculations)
├── Tailwind CSS (utility-first styling)
├── Recharts (React-native charts, composable)
├── React Hook Form (performant forms)
├── Vite (fast dev experience)
└── LocalStorage (simple persistence)
```

**Key Decision**: No Zustand or external state management. Use React Context API for shared state, local component state for UI, and custom hooks for calculations.

### Project Structure
```
src/
├── components/
│   ├── layout/           # Shell, navigation, panels
│   ├── inputs/           # Form sections, input groups
│   ├── charts/           # Visualization components
│   ├── insights/         # Decision cards, recommendations
│   └── ui/              # Reusable primitives (Button, Card, etc.)
├── hooks/
│   ├── useCalculations.ts    # Core financial math
│   ├── useChartData.ts       # Transform data for charts
│   └── usePersistence.ts     # localStorage sync
├── lib/
│   ├── calculations/         # Pure calculation functions
│   │   ├── mortgage.ts
│   │   ├── cashflow.ts
│   │   ├── taxes.ts
│   │   └── opportunity.ts
│   ├── formatters.ts         # Number/currency formatting
│   └── validators.ts         # Input validation
├── context/
│   └── PropertyContext.tsx   # Shared state (if needed)
└── types/
    └── property.ts           # TypeScript interfaces
```

---

## 🎨 UI/UX Design Principles

### 1. **Two-Panel Layout** (Desktop)
```
┌──────────────────┬─────────────────────────────┐
│                  │  [Insights] [Charts]        │
│   INPUTS         │  ────────────────────       │
│   (scrollable)   │                             │
│                  │  Active Tab Content:        │
│  Property        │                             │
│  Financing       │  INSIGHTS TAB:              │
│  Income          │  💰 Monthly Cash Flow       │
│  Expenses        │  📈 Cash-on-Cash Return     │
│  Projections     │  🏠 10-Year Equity          │
│  Taxes           │  ⚖️  Hold vs Sell           │
│                  │  💡 Recommendation          │
│  [Save] [Reset]  │  ⚠️  Risk Factors           │
│                  │                             │
│                  │  CHARTS TAB:                │
│                  │  📊 [Cash Flow] [Equity]    │
│                  │      [Comparison] [More]    │
│                  │                             │
│                  │  [Selected Chart Display]   │
└──────────────────┴─────────────────────────────┘
      ~35%                    ~65%
```

**Benefits**:
- Cleaner, less overwhelming
- More space for charts when viewing them
- Tab switching keeps focus clear
- Easier to implement responsively

### 2. **Mobile: Single Column with Tabs**
```
┌─────────────────────────┐
│ [Inputs] [Results]      │
│ ─────────────────────   │
│                         │
│ Active Tab Content      │
│                         │
│ (Full width, scrolls)   │
│                         │
└─────────────────────────┘
```

### 3. **Insights Tab** (Results Panel)
Large, colorful metric cards with clear visual hierarchy:

- **Hero Metrics** (3-4 large cards in grid)
  - Monthly Cash Flow (green/red, large number)
  - Cash-on-Cash Return % (with benchmark comparison)
  - 10-Year Net Wealth (projected)
  - Total Annualized Return %

- **Decision Support Card**
  - "Should I Hold or Sell?"
  - Visual gauge/recommendation
  - Key reasoning bullets
  - Confidence indicator

- **Risk & Sensitivity Card**
  - Vacancy impact
  - Maintenance reserve adequacy
  - Interest rate sensitivity
  - Quick "what-if" adjustments

### 4. **Charts Tab** (Results Panel)
Secondary tab navigation for chart selection:

```
[Cash Flow] [Equity] [Hold vs Sell] [Breakdown] [Amortization]
────────────────────────────────────────────────────────────

              [Chart Display Area]
                  (full height)

────────────────────────────────────────────────────────────
```

Charts:
1. **Cash Flow Timeline**: Bar chart (annual) + cumulative line
2. **Equity Growth**: Stacked area (principal paydown + appreciation)
3. **Hold vs Sell Comparison**: Dual projection lines with shaded areas
4. **Wealth Breakdown**: Stacked bar (sources: equity, cash flow, appreciation, tax savings)
5. **Amortization Schedule**: Principal vs interest over time

### 5. **Input Panel Organization**
Clean collapsible sections with smart defaults:

```
🏠 Property Details
  • Property Value (purchase or current)
  • Property Type: [SFH] [Duplex] [Triplex] [Fourplex]

💰 Financing
  • Mode: [New Purchase] [Existing Property]

  [New Purchase]:
  • Down Payment % (slider + input)
  • Interest Rate %
  • Loan Term (years)
  • Closing Costs (auto-calc, editable)

  [Existing Property]:
  • Current Loan Balance
  • Monthly Payment (P&I or PITI)
  • Interest Rate %
  • Remaining Term (years)
  • Payment includes taxes/insurance? [checkbox]

💵 Income
  • Mode: [Detailed] [Net Income Only]

  [Detailed]:
  • Monthly Rent
  • Vacancy Rate %
  • Other Income ($/month)

  [Net Income]:
  • Net Monthly Income (after mgmt & maintenance)

📉 Operating Expenses
  (Show when in Detailed mode)
  • Property Tax ($/year)
  • Insurance ($/year)
  • HOA Fees ($/month)
  • Utilities ($/month)
  • Maintenance % (of rent)
  • Property Management % (of rent)
  • CapEx Reserve % (of rent)

📈 Growth Projections
  • Analysis Period: [5] [10] [20] [30] years
  • Property Appreciation %/year
  • Rent Growth %/year
  • Expense Growth %/year

🧾 Tax & Opportunity Cost
  • Tax Bracket %
  • Depreciation Period (years) [default: 27.5]
  • Building Value % [default: 80%]

  Opportunity Cost Analysis:
  • Alternative Investment Return %
  • Selling Costs %
```

**Input Design Details**:
- Currency inputs with $ prefix
- Percentage inputs with % suffix
- Sliders for key inputs (down payment, rates)
- Inline validation with helpful messages
- Smart defaults based on property type
- Tooltips on every field (hover/tap)
- Subtle animations on focus

---

## 💎 Key Features

### 1. **Beautiful, Modern Interface**

**Design Language**:
- **Cards**: Soft shadows, rounded corners (lg), subtle borders
- **Gradients**: Tasteful gradients for hero sections, key metrics
- **Typography**: Clean hierarchy, generous spacing
  - Headings: font-semibold, tracking-tight
  - Metrics: font-bold, tabular-nums, large
  - Labels: text-sm, text-slate-600, uppercase tracking-wide
- **Color**: Meaningful color coding
  - Positive cash flow: emerald-500
  - Negative cash flow: rose-500
  - Neutral/info: blue-500
  - Warning: amber-500
- **Spacing**: Generous whitespace, clear visual grouping
- **Micro-interactions**:
  - Smooth transitions (transition-all duration-200)
  - Hover states on interactive elements
  - Focus rings for accessibility
  - Loading states for calculations

**Component Polish**:
- Custom-styled form inputs (not default browser)
- Beautiful number formatting (commas, currency symbols)
- Progress indicators for sliders
- Toggle switches (not checkboxes) for modes
- Icon usage throughout (lucide-react or heroicons)
- Responsive spacing (sm:, md:, lg: breakpoints)

### 2. **Data Persistence** (Simple to Start)

**Phase 1**: Single auto-save
```typescript
// Auto-save inputs to localStorage on change (debounced)
useEffect(() => {
  const timer = setTimeout(() => {
    localStorage.setItem('rental-calc-inputs', JSON.stringify(inputs));
  }, 500);
  return () => clearTimeout(timer);
}, [inputs]);

// Auto-load on mount
useEffect(() => {
  const saved = localStorage.getItem('rental-calc-inputs');
  if (saved) setInputs(JSON.parse(saved));
}, []);
```

**Phase 2** (Future): Multiple saved scenarios
- "Save Scenario" button → prompts for name
- Dropdown to load saved scenarios
- Export/import JSON

### 3. **Intelligent Defaults**

Property type affects defaults:
```typescript
const DEFAULTS_BY_TYPE = {
  SFH: { maintenance: 1.5, capex: 1.0, vacancy: 5 },
  Duplex: { maintenance: 2.0, capex: 1.5, vacancy: 7 },
  Triplex: { maintenance: 2.5, capex: 2.0, vacancy: 8 },
  Fourplex: { maintenance: 3.0, capex: 2.5, vacancy: 8 }
};
```

### 4. **Responsive Excellence**

Breakpoints:
- Mobile: < 640px (single column, tabs)
- Tablet: 640px - 1024px (two columns, inputs may collapse)
- Desktop: > 1024px (two panels side-by-side)

Mobile considerations:
- Larger touch targets (min 44x44px)
- Collapsible input sections (start collapsed)
- Bottom sheet for charts
- Simplified tooltips (tap to open)

---

## 🧮 Calculation Architecture

### Core Principles
1. **Pure Functions**: All calculations are pure, testable
2. **Memoization**: Cache expensive calculations with useMemo
3. **Precision**: Use proper rounding for financial math
4. **Transparency**: Show how numbers are calculated

### State Management Pattern

**Simple Context for Shared State**:
```typescript
// PropertyContext.tsx
const PropertyContext = createContext<PropertyContextType | null>(null);

export function PropertyProvider({ children }) {
  const [inputs, setInputs] = useState<PropertyInputs>(DEFAULT_INPUTS);

  const calculations = useCalculations(inputs); // memoized hook

  return (
    <PropertyContext.Provider value={{ inputs, setInputs, calculations }}>
      {children}
    </PropertyContext.Provider>
  );
}
```

**Component-Level State**:
```typescript
// Individual components manage their own UI state
function InputPanel() {
  const { inputs, setInputs } = usePropertyContext();
  const [collapsed, setCollapsed] = useState({ property: false, financing: false });
  // ...
}
```

### Calculation Flow
```
Input Change →
  State Update →
    useCalculations Hook (memoized) →
      { mortgage, cashFlow, taxes, wealth, opportunity } →
        UI Components Re-render
```

### Hook Structure
```typescript
function useCalculations(inputs: PropertyInputs) {
  // Each calculation memoized with appropriate dependencies

  const mortgage = useMemo(() =>
    calculateMortgage(inputs.financing),
    [inputs.financing]
  );

  const yearlyProjections = useMemo(() =>
    calculateYearlyData(inputs, mortgage),
    [inputs, mortgage]
  );

  const opportunityCost = useMemo(() =>
    calculateHoldVsSell(yearlyProjections, inputs),
    [yearlyProjections, inputs.opportunity]
  );

  // Derived metrics
  const cashOnCashReturn = useMemo(() =>
    (yearlyProjections[0].cashFlow / inputs.totalInvestment) * 100,
    [yearlyProjections, inputs.totalInvestment]
  );

  return {
    mortgage,
    yearlyProjections,
    opportunityCost,
    cashOnCashReturn,
    // ... more derived metrics
  };
}
```

---

## 🎨 Visual Design System

### Color Palette (Tailwind)
```css
/* Primary */
blue-600    #2563eb  (trust, finance, primary actions)
blue-50     #eff6ff  (subtle backgrounds)

/* Semantic Colors */
emerald-500 #10b981  (positive, profit, growth)
rose-500    #f43f5e  (negative, loss, risk)
amber-500   #f59e0b  (warning, caution)
slate-700   #334155  (text primary)
slate-500   #64748b  (text secondary)

/* Backgrounds */
white       #ffffff  (cards, panels)
slate-50    #f8fafc  (app background)
slate-100   #f1f5f9  (subtle dividers)

/* Gradients */
from-blue-500 to-blue-700     (headers, hero metrics)
from-emerald-400 to-emerald-600  (positive highlights)
from-rose-400 to-rose-600     (negative highlights)
```

### Typography Scale
```
text-3xl font-bold  →  Metric Values ($4,250/mo)
text-xl font-semibold  →  Section Headers
text-base  →  Body, input values
text-sm text-slate-600  →  Labels, descriptions
text-xs uppercase tracking-wide  →  Field labels
```

### Spacing System
```
p-8   →  Main panel padding (desktop)
p-4   →  Main panel padding (mobile)
p-6   →  Card padding
space-y-6  →  Between major sections
space-y-4  →  Between input groups
space-y-2  →  Between label and input
gap-4  →  Grid gaps
```

### Component Styling Examples

**Metric Card**:
```tsx
<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
  <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">
    Monthly Cash Flow
  </div>
  <div className="text-3xl font-bold tabular-nums text-emerald-600">
    $1,245
  </div>
  <div className="text-sm text-slate-600 mt-2">
    <span className="text-emerald-600">↑ 12%</span> from Year 1
  </div>
</div>
```

**Input Field**:
```tsx
<div className="space-y-2">
  <label className="block text-xs uppercase tracking-wide text-slate-600">
    Property Value
  </label>
  <div className="relative">
    <span className="absolute left-3 top-2.5 text-slate-500">$</span>
    <input
      type="number"
      className="w-full pl-7 pr-3 py-2 border border-slate-300 rounded-lg
                 focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                 transition-all"
      value={value}
      onChange={handleChange}
    />
  </div>
</div>
```

**Toggle Switch**:
```tsx
<div className="flex items-center space-x-3">
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      mode === 'new'
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
    onClick={() => setMode('new')}
  >
    New Purchase
  </button>
  <button
    className={`px-4 py-2 rounded-lg font-medium transition-all ${
      mode === 'existing'
        ? 'bg-blue-600 text-white shadow-sm'
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
    onClick={() => setMode('existing')}
  >
    Existing Property
  </button>
</div>
```

---

## 🚀 Development Phases (Iterative)

### Phase 1: Solid Foundation ⭐
**Goal**: Basic app works perfectly

**Week 1**:
- [x] Project setup (Vite + React + TS + Tailwind)
- [x] Design system basics (colors, typography, component primitives)
- [x] Layout shell (two-panel desktop, single column mobile)
- [x] Tab system (Insights/Charts in right panel)

**Week 2**:
- [x] All input components (beautiful, functional)
- [x] Form state management (React Hook Form or useState)
- [x] Input validation and error display
- [x] Collapsible sections in input panel
- [x] Responsive layout working

**Week 3**:
- [x] Core calculation library (pure functions)
  - Mortgage calculations
  - Cash flow projections
  - Tax calculations
  - Opportunity cost analysis
- [x] useCalculations hook with proper memoization
- [x] Unit tests for all calculations
- [x] Number formatting utilities

**Week 4**:
- [x] Insights tab (all metric cards)
- [x] Basic charts (cash flow, equity at minimum)
- [x] Charts tab with chart selector
- [x] localStorage persistence (auto-save)
- [x] Polish and refinement

**Deliverable**: Fully functional calculator with beautiful UI, accurate calculations, and responsive design.

---

### Phase 2: Enhanced Features
(After Phase 1 is complete and tested)

- [ ] Hold vs Sell decision card with visual gauge
- [ ] All 5 chart types
- [ ] Risk indicators and sensitivity highlights
- [ ] Tooltips and educational content
- [ ] Loading states and animations
- [ ] Print/export basic functionality

---

### Phase 3: Advanced Features
(Future enhancements)

- [ ] Multiple saved scenarios
- [ ] Scenario comparison view
- [ ] Preset templates
- [ ] PDF export
- [ ] URL sharing
- [ ] Advanced sensitivity analysis

---

## 🧪 Testing Strategy

```
Unit Tests: Vitest
  ✓ All calculation functions
  ✓ Formatters and validators
  ✓ Custom hooks (with @testing-library/react-hooks)

Integration Tests: Playwright (later phases)
  ✓ User flows (input → results)
  ✓ Persistence (save/load)
  ✓ Responsive behavior

Manual Testing Checklist:
  ✓ All calculations match expected values
  ✓ UI updates in real-time
  ✓ localStorage works (clear and reload)
  ✓ Mobile usability (touch targets, scrolling)
  ✓ Accessibility (keyboard nav, screen reader)
```

---

## 📊 Success Metrics

### User Experience
- ✅ Inputs update results in <100ms (instant feedback)
- ✅ Beautiful on all screen sizes (mobile, tablet, desktop)
- ✅ Intuitive (new users succeed without help)
- ✅ Professional appearance (inspire confidence)

### Code Quality
- ✅ TypeScript strict mode (no any types)
- ✅ Pure calculation functions (testable)
- ✅ Minimal re-renders (proper memoization)
- ✅ Clean component structure (< 200 lines each)
- ✅ Reusable primitives (Button, Card, Input, etc.)

---

## 🎯 Key Implementation Notes

### 1. Keep It Simple
- Start with useState/useContext, no complex state libraries
- One feature at a time, fully complete
- Don't over-engineer early

### 2. Make It Beautiful
- Every component should look polished
- Consistent spacing and colors
- Smooth transitions and hover states
- Professional typography

### 3. Iterate Thoughtfully
- Phase 1 must be rock-solid before Phase 2
- Test thoroughly at each phase
- Refactor as you learn

### 4. Focus on Core Value
- Accurate calculations (trust)
- Clear insights (understanding)
- Beautiful presentation (delight)

---

## 🔮 Future Vision

Once foundation is solid:
- **Collaboration**: Share scenarios with partners
- **Market Data**: Integration with rental comps APIs
- **Portfolio**: Multiple property tracking
- **Advanced Scenarios**: 1031 exchanges, seller financing
- **AI Insights**: Natural language recommendations

---

## 📝 Technical Decisions Log

| Decision | Rationale |
|----------|-----------|
| No Zustand | React's built-in state is sufficient for this app size |
| Two-panel layout | Cleaner than three panels, better for focus |
| Tabbed results | More space for content, less overwhelm |
| localStorage only | Simple persistence, no backend needed initially |
| Recharts | React-native, composable, good docs |
| React Hook Form | Performance, less boilerplate than controlled forms |
| Vite | Fast dev experience, modern tooling |

---

**Ready to build a beautiful, professional rental property calculator that investors will love!** 🚀

