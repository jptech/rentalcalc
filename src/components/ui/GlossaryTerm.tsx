import { HelpCircle } from 'lucide-react';
import { useState } from 'react';

interface GlossaryTermProps {
  term: string;
  definition: string;
  formula?: string;
  example?: string;
}

const GLOSSARY: Record<string, Omit<GlossaryTermProps, 'term'>> = {
  'NOI': {
    definition: 'Net Operating Income - The income from property after all operating expenses, but before mortgage payments.',
    formula: 'NOI = Gross Income - Operating Expenses',
    example: '$3,000 rent - $800 expenses = $2,200 NOI',
  },
  'Cap Rate': {
    definition: 'Capitalization Rate - The rate of return on a property based on the income it generates.',
    formula: 'Cap Rate = NOI / Property Value',
    example: '$26,400 annual NOI / $400,000 = 6.6% cap rate',
  },
  'CoC Return': {
    definition: 'Cash-on-Cash Return measures how much cash you earn each year relative to the cash you invested upfront. It helps you understand your immediate return on investment.',
    formula: 'Annual Cash Flow ÷ Total Cash Invested',
    example: 'If you earn $8,000 in year 1 cash flow on an $80,000 investment, your CoC Return is 10%',
  },
  'CapEx': {
    definition: 'Capital Expenditures - Reserve fund for major repairs like roof, HVAC, appliances.',
    formula: 'Typically 1-2% of monthly rent',
    example: '$3,000 rent × 1% = $30/month CapEx reserve',
  },
  'Equity': {
    definition: 'The difference between property value and the loan balance.',
    formula: 'Equity = Property Value - Loan Balance',
    example: '$450,000 value - $300,000 loan = $150,000 equity',
  },
  'IRR': {
    definition: 'Internal Rate of Return - The annualized rate of return that makes the NPV of all cash flows equal to zero.',
    formula: 'Calculated using iterative methods',
    example: 'A property with 12% IRR grows invested capital at 12% annually',
  },
  'Total Return': {
    definition: 'Total Return is the annualized rate at which your total wealth grows over time. It includes cash flow, equity buildup from paying down the mortgage, and property appreciation.',
    formula: '((Final Wealth ÷ Initial Investment)^(1 ÷ Years)) - 1',
    example: 'If your $200k investment grows to $400k over 10 years, your total return is 7.2% per year',
  },
  'Tax Savings': {
    definition: 'Tax Savings come from rental property tax deductions. When your deductible expenses (mortgage interest, property taxes, insurance, maintenance, depreciation) exceed your rental income, you create a tax loss that reduces your overall tax bill.',
    formula: 'Tax Deduction × Your Tax Bracket',
    example: 'If you have a $10,000 tax loss and are in the 24% tax bracket, you save $2,400 in taxes',
  },
};

export function GlossaryTerm({ term }: { term: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const info = GLOSSARY[term];

  if (!info) return <span>{term}</span>;

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline cursor-help"
      >
        {term}
        <HelpCircle className="w-3.5 h-3.5" />
      </button>

      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 w-80 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-fadeIn">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{term}</h4>
              <p className="text-sm text-slate-700 dark:text-slate-300">{info.definition}</p>
            </div>

            {info.formula && (
              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Formula</div>
                <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded font-mono text-slate-800 dark:text-slate-200">
                  {info.formula}
                </code>
              </div>
            )}

            {info.example && (
              <div>
                <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">Example</div>
                <p className="text-xs text-slate-600 dark:text-slate-400">{info.example}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
}
