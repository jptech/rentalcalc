# 🏡 Rental Property Calculator

A modern, comprehensive rental property analysis tool built with React, TypeScript, and Tailwind CSS. Analyze cash flow, equity buildup, tax advantages, and make informed hold vs. sell decisions with beautiful visualizations.

## ✨ Features

### 🎯 Dual Analysis Modes
- **New Purchase**: Evaluate properties you're considering buying
- **Existing Property**: Analyze properties you already own

### 💰 Flexible Income Tracking
- **Detailed Mode**: Track all income and expenses individually
- **Net Income Mode**: Simplified tracking for managed properties

### 📊 Comprehensive Analysis
- Monthly and annual cash flow projections
- Cash-on-Cash return calculations
- Cap rate and ROI metrics
- Equity buildup tracking
- Tax advantage calculations (depreciation, deductions)
- Opportunity cost analysis (Hold vs. Sell)

### 📈 Interactive Visualizations
1. **Cash Flow Over Time**: Annual cash flow and cumulative tracking
2. **Equity Growth**: Property value and equity buildup
3. **Hold vs. Sell Comparison**: Wealth projection scenarios
4. **Wealth Breakdown**: Sources of wealth accumulation

### 🎨 Beautiful UI/UX
- Modern, professional design with Tailwind CSS
- Responsive layout (mobile, tablet, desktop)
- Real-time calculations with instant feedback
- Smart tooltips and help text
- Auto-save to localStorage
- Collapsible input sections for better organization

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 22+ (recommended)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Recharts** - Data visualization
- **Lucide React** - Icons

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/       # App layout, header, panels
│   ├── inputs/       # Input forms and controls
│   ├── charts/       # Chart components
│   ├── insights/     # Metric cards and insights
│   └── ui/          # Reusable UI primitives
├── hooks/
│   └── useCalculations.ts  # Main calculation hook
├── lib/
│   ├── calculations/       # Pure calculation functions
│   │   ├── mortgage.ts
│   │   ├── cashflow.ts
│   │   └── opportunity.ts
│   └── formatters.ts      # Number/currency formatting
└── types/
    └── property.ts        # TypeScript interfaces
```

## 💡 Usage

### Input Sections

1. **Property Details**
   - Property value and type (SFH, Duplex, etc.)
   - Different types auto-adjust default expense percentages

2. **Financing**
   - Toggle between New Purchase and Existing Property
   - Down payment, interest rate, loan term
   - For existing: current balance, payment, remaining term

3. **Income**
   - Detailed mode: Monthly rent, vacancy rate, other income
   - Net income mode: Simplified net monthly income

4. **Operating Expenses** (Detailed mode)
   - Property tax, insurance, HOA fees
   - Utilities, maintenance, management, CapEx reserves
   - Percentages auto-calculate dollar amounts

5. **Growth Projections**
   - Analysis period (5, 10, 20, 30 years)
   - Appreciation, rent growth, expense growth rates

6. **Tax & Opportunity Cost**
   - Tax bracket, depreciation settings
   - Alternative investment return rate
   - Selling costs percentage

### Results

**Insights Tab:**
- Hero metrics (cash flow, returns, wealth)
- Hold vs. Sell recommendation with reasoning
- Risk factors and warnings
- Detailed breakdowns

**Charts Tab:**
- Select from 4 interactive visualizations
- Hover for detailed tooltips
- Visual trends and comparisons

## 🧮 Calculation Methodology

### Mortgage
- Standard amortization formula: `M = P[r(1+r)^n]/[(1+r)^n-1]`
- Full amortization schedule generation
- Accurate principal/interest split

### Tax Calculations
- Residential property depreciation (27.5 years)
- Only building value depreciates (default 80%)
- Deductible expenses include:
  - Mortgage interest
  - Operating expenses
  - Property taxes and insurance
  - Depreciation

### Opportunity Cost
- **Hold**: Future property value + cumulative cash flows + tax savings
- **Sell**: Current equity - selling costs, invested at alternative return rate
- Recommendation based on final wealth comparison

## 🎨 Design Features

- **Professional color scheme** with meaningful semantic colors
- **Smooth transitions** and micro-interactions
- **Responsive breakpoints**: Mobile-first design
- **Accessible**: Keyboard navigation, proper focus states
- **Tabular numbers** for financial data alignment
- **Custom scrollbars** for polished appearance

## 💾 Data Persistence

- All inputs automatically save to localStorage
- Auto-loads on page refresh
- Reset button to restore defaults

## ⚠️ Disclaimer

This calculator is for educational and informational purposes only. It does not constitute financial, tax, or investment advice.

**Key Limitations:**
- Tax calculations are simplified (consult a CPA)
- Appreciation and rent growth are projections
- Local market conditions vary significantly
- Does not account for all possible expenses

Always consult with qualified professionals before making investment decisions.

## 📄 License

MIT License - Free to use for personal or commercial purposes.

---

**Built with ❤️ for rental property investors**
