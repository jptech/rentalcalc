import { useState } from 'react';
import { CalculationResults } from '../../types/property';
import { CashFlowChart } from './CashFlowChart';
import { EquityChart } from './EquityChart';
import { ComparisonChart } from './ComparisonChart';
import { WealthBreakdownChart } from './WealthBreakdownChart';
import { Card, CardContent } from '../ui/Card';

interface ChartsTabProps {
  results: CalculationResults;
}

type ChartType = 'cashflow' | 'equity' | 'comparison' | 'breakdown';

export function ChartsTab({ results }: ChartsTabProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('cashflow');

  const charts: { id: ChartType; label: string }[] = [
    { id: 'cashflow', label: 'Cash Flow' },
    { id: 'equity', label: 'Equity Growth' },
    { id: 'comparison', label: 'Hold vs Sell' },
    { id: 'breakdown', label: 'Wealth Breakdown' },
  ];

  return (
    <div className="space-y-4">
      {/* Chart Selector */}
      <div className="flex flex-wrap gap-2">
        {charts.map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              activeChart === chart.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {chart.label}
          </button>
        ))}
      </div>

      {/* Chart Display */}
      <Card>
        <CardContent className="p-6">
          {activeChart === 'cashflow' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Cash Flow Over Time
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Annual cash flow and cumulative total over the analysis period.
              </p>
              <CashFlowChart data={results.yearlyData} />
            </div>
          )}

          {activeChart === 'equity' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Equity Growth & Property Value
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Track equity buildup through principal paydown and property appreciation.
              </p>
              <EquityChart data={results.yearlyData} />
            </div>
          )}

          {activeChart === 'comparison' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Hold vs. Sell Comparison
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Compare wealth accumulation: holding the property vs. selling and investing proceeds.
              </p>
              <ComparisonChart analysis={results.opportunityCost} />
            </div>
          )}

          {activeChart === 'breakdown' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                Wealth Accumulation Breakdown
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Sources of wealth: equity, cumulative cash flow, and tax savings over time.
              </p>
              <WealthBreakdownChart data={results.yearlyData} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
