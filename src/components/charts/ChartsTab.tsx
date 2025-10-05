import { useState } from 'react';
import { Download } from 'lucide-react';
import type { CalculationResults } from '../../types/property';
import { CashFlowChart } from './CashFlowChart';
import { EquityChart } from './EquityChart';
import { ComparisonChart } from './ComparisonChart';
import { WealthBreakdownChart } from './WealthBreakdownChart';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { exportToCSV } from '../../lib/chartExport';

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

  const handleExport = () => {
    const chartDataMap = {
      cashflow: results.yearlyData.map(d => ({
        Year: d.year,
        'Cash Flow': d.cashFlow,
        'Cumulative Cash Flow': d.cumulativeCashFlow,
      })),
      equity: results.yearlyData.map(d => ({
        Year: d.year,
        'Property Value': d.propertyValue,
        'Loan Balance': d.loanBalance,
        'Equity': d.equity,
      })),
      comparison: results.opportunityCost.holdScenario.yearlyWealth.map((wealth, i) => ({
        Year: i + 1,
        'Hold Property': wealth,
        'Sell & Invest': results.opportunityCost.sellScenario.yearlyWealth[i],
      })),
      breakdown: results.yearlyData.map(d => ({
        Year: d.year,
        'Equity': d.equity,
        'Cumulative Cash Flow': d.cumulativeCashFlow,
        'Tax Savings': d.cumulativeTaxSavings,
      })),
    };

    const activeChartData = chartDataMap[activeChart];
    const chartLabel = charts.find(c => c.id === activeChart)?.label || 'chart';

    exportToCSV(activeChartData, `${chartLabel.toLowerCase().replace(/ /g, '-')}-data`);
  };

  return (
    <div className="space-y-4">
      {/* Chart Selector with Export */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          {charts.map((chart) => (
            <button
              key={chart.id}
              onClick={() => setActiveChart(chart.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeChart === chart.id
                  ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {chart.label}
            </button>
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleExport}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </Button>
      </div>

      {/* Chart Display */}
      <Card className="bg-white dark:bg-slate-800">
        <CardContent className="p-6">
          {activeChart === 'cashflow' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Cash Flow Over Time
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Annual cash flow and cumulative total over the analysis period.
              </p>
              <CashFlowChart data={results.yearlyData} />
            </div>
          )}

          {activeChart === 'equity' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Equity Growth & Property Value
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Track equity buildup through principal paydown and property appreciation.
              </p>
              <EquityChart data={results.yearlyData} />
            </div>
          )}

          {activeChart === 'comparison' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Hold vs. Sell Comparison
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                Compare wealth accumulation: holding the property vs. selling and investing proceeds.
              </p>
              <ComparisonChart analysis={results.opportunityCost} />
            </div>
          )}

          {activeChart === 'breakdown' && (
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                Wealth Accumulation Breakdown
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
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
