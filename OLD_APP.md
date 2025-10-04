# 🏡 Rental Property Financial Calculator

A comprehensive, interactive web-based financial calculator for evaluating rental property investment scenarios. Analyze cash flow, equity buildup, tax advantages, and opportunity costs with beautiful visualizations.

![Rental Property Calculator](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🚀 Features

### Investment Analysis Modes
- **New Purchase Mode**: Evaluate properties you're considering buying
  - Down payment and loan term calculations
  - Closing cost estimates
  - Full mortgage amortization

- **Existing Property Mode**: Analyze properties you already own
  - Current loan balance and payment input
  - Support for PITI (Principal, Interest, Taxes, Insurance) payments
  - Remaining loan term tracking

### Income & Expense Tracking
- **Detailed Mode**: Track all income and expenses individually
  - Gross rent income with vacancy rates
  - Property taxes, insurance, HOA fees
  - Utilities, maintenance, property management fees
  - Rent growth projections

- **Net Income Mode**: Simplified tracking for managed properties
  - Enter net income after management fees and maintenance
  - Automatic utility and mortgage deductions
  - Perfect for hands-off investors

### Financial Calculations
- **Cash Flow Analysis**
  - Monthly and annual cash flow projections
  - Cash-on-Cash return calculations
  - Cap rate (Capitalization Rate)
  - Net Operating Income (NOI)

- **Tax Advantages**
  - Depreciation calculations (27.5-year residential property depreciation)
  - Mortgage interest deductions
  - Operating expense deductions
  - Tax bracket considerations
  - Capital gains tax on sale

- **Wealth Accumulation**
  - Equity buildup through principal payments
  - Property appreciation projections
  - Cumulative cash flow tracking
  - Tax savings accumulation

- **Opportunity Cost Analysis**
  - Compare holding property vs. selling and investing
  - Alternative investment return modeling
  - Annualized return comparisons
  - Net proceeds calculations with selling costs

### Interactive Visualizations

#### 1. Cash Flow Over Time
- Annual cash flow trends (bar chart)
- Cumulative cash flow tracking (line chart)
- Color-coded positive/negative cash flows

#### 2. Equity & Property Value Growth
- Property value appreciation over time
- Equity buildup visualization
- Loan balance reduction tracking

#### 3. Wealth Comparison: Hold vs. Sell
- Side-by-side wealth projection comparison
- Visual decision-making tool
- Smart recommendations based on scenarios

#### 4. Wealth Accumulation Breakdown
- Stacked bar chart showing wealth sources:
  - Equity built through principal payments
  - Property appreciation gains
  - Cumulative cash flow
  - Tax savings accumulation

#### 5. Mortgage Payment Breakdown
- Principal vs. Interest over time
- PITI breakdown for existing properties
- Visual representation of amortization schedule

### User Experience Features
- **Persistent Storage**: All inputs saved to localStorage
- **Reset to Defaults**: One-click reset button
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Real-time Updates**: Calculations update as you type
- **Dark Theme**: Modern, eye-friendly interface

## 🛠 Technical Stack

### Frontend
- **HTML5**: Semantic markup structure
- **CSS3**: Modern styling with CSS Grid and Flexbox
  - Custom CSS variables for theming
  - Smooth animations and transitions
  - Responsive breakpoints

- **Vanilla JavaScript (ES6+)**: No framework dependencies
  - Class-based architecture
  - Event-driven calculations
  - Modular calculation methods

### Data Visualization
- **Chart.js 4.4.0**: Interactive, responsive charts
  - Bar charts for cash flow and breakdowns
  - Line charts for trends
  - Stacked bar charts for accumulation
  - Custom tooltips and legends

### Storage
- **localStorage API**: Client-side data persistence
  - Automatic save on input changes
  - State restoration on page load
  - Mode and configuration persistence

## 📊 Calculation Methodology

### Mortgage Calculations
- **Standard Amortization Formula**: `M = P[r(1+r)^n]/[(1+r)^n-1]`
  - P = Principal (loan amount)
  - r = Monthly interest rate
  - n = Number of payments

- **Loan Balance Tracking**: Accurate principal reduction over time
- **Interest/Principal Split**: Calculated from amortization schedule

### Tax Calculations
- **Depreciation**: Residential property depreciated over 27.5 years
  - Only building value (80% of property) is depreciated
  - Land is not depreciable

- **Deductible Expenses**:
  - Mortgage interest
  - Operating expenses (management, maintenance, utilities)
  - Property taxes and insurance
  - Depreciation

- **Tax Savings**: `Tax Benefit = Tax Bracket × (Deductible Expenses - Income)`

### Opportunity Cost Analysis
- **Hold Property Scenario**:
  - Net proceeds from future sale
  - Plus cumulative cash flows
  - Minus taxes on capital gains

- **Sell & Invest Scenario**:
  - Current equity minus selling costs
  - Compounded at alternative return rate
  - No property income (property is sold)

### Return Metrics
- **Cash-on-Cash Return**: `Annual Cash Flow / Total Investment × 100`
- **Cap Rate**: `NOI / Property Value × 100`
- **Annualized Return**: Geometric mean return over analysis period

## 🚦 Getting Started

### Installation
No installation required! Simply open `index.html` in a modern web browser.

```bash
# Clone or download the repository
git clone <repository-url>

# Navigate to the directory
cd rental-property-calculator

# Open in browser
open index.html
# or
start index.html  # Windows
```

### File Structure
```
rental-property-calculator/
├── index.html          # Main HTML structure
├── styles.css          # All styling and responsive design
├── calculator.js       # Core calculation logic and charts
└── README.md          # This file
```

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 💡 Usage Guide

### For New Property Evaluation
1. Select "New Purchase" mode
2. Enter property value and down payment
3. Set interest rate and loan term
4. Input expected rental income and expenses
5. Adjust appreciation and rent growth rates
6. Review cash flow and return metrics

### For Existing Property Analysis
1. Select "Existing Property" mode
2. Enter current property value and loan balance
3. Input your monthly mortgage payment
4. Set your interest rate and remaining loan term
5. Check "PITI" if payment includes taxes & insurance
6. Switch to "Net Income" mode if you have managed properties
7. Compare hold vs. sell scenarios

### Opportunity Cost Analysis
1. Set alternative investment return rate (e.g., 7% for S&P 500)
2. Adjust selling costs percentage (typically 6%)
3. Review "Hold vs. Sell Comparison" results
4. Check wealth accumulation breakdown chart
5. Use recommendation to inform decision

## 🔧 Customization

### Default Values
Edit `index.html` to change default input values:
```html
<input type="number" id="propertyValue" value="400000" ...>
```

### Styling
Modify CSS variables in `styles.css`:
```css
:root {
    --primary: #3b82f6;
    --success: #22c55e;
    --danger: #ef4444;
    /* ... */
}
```

### Calculation Logic
Core calculations are in `calculator.js`:
- `calculateMortgage()`: Mortgage payment calculations
- `calculateYearlyData()`: Annual projections
- `calculateOpportunityCost()`: Hold vs. sell analysis

## 🤝 Contributing

Contributions are welcome! Areas for enhancement:
- Additional chart types (waterfall charts, sensitivity analysis)
- Export to PDF/Excel functionality
- Multiple property comparison
- Refinancing scenario modeling
- 1031 exchange analysis

## 📝 License

MIT License - feel free to use this calculator for personal or commercial purposes.

## ⚠️ Disclaimer

This calculator is for educational and informational purposes only. It does not constitute financial, tax, or investment advice. Consult with qualified professionals before making investment decisions.

Key assumptions and limitations:
- Tax calculations are simplified (consult a CPA for accurate tax planning)
- Does not account for all expenses (repairs, vacancies, CapEx)
- Appreciation and rent growth are projections, not guarantees
- Does not include leverage effects beyond mortgage
- Local market conditions may vary significantly

## 🙏 Acknowledgments

Built with:
- [Chart.js](https://www.chartjs.org/) for data visualization
- Modern web standards (HTML5, CSS3, ES6+)
- Love for real estate investing 🏡

---

**Made for rental property investors, by rental property investors.**
