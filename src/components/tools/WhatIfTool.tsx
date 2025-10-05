import { useState } from 'react';
import { Sliders, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { PropertyInputs, CalculationResults } from '../../types/property';
import { useCalculations } from '../../hooks/useCalculations';
import { formatCurrency, formatPercent } from '../../lib/formatters';

interface WhatIfToolProps {
  baseInputs: PropertyInputs;
  baseResults: CalculationResults;
}

export function WhatIfTool({ baseInputs, baseResults }: WhatIfToolProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [adjustments, setAdjustments] = useState({
    rentDelta: 0, // percentage change
    appreciationDelta: 0,
    expenseDelta: 0,
  });

  // Create adjusted inputs - ensure new object reference on every adjustment change
  const adjustedInputs: PropertyInputs = {
    ...baseInputs,
    monthlyRent: baseInputs.monthlyRent * (1 + adjustments.rentDelta / 100),
    netMonthlyIncome: baseInputs.incomeMode === 'net'
      ? baseInputs.netMonthlyIncome * (1 + adjustments.rentDelta / 100)
      : baseInputs.netMonthlyIncome,
    appreciationRate: baseInputs.appreciationRate + adjustments.appreciationDelta,
    expenseGrowthRate: baseInputs.expenseGrowthRate + adjustments.expenseDelta,
  };

  const adjustedResults = useCalculations(adjustedInputs);

  const metrics = [
    {
      label: 'Year 1 Monthly Cash Flow',
      base: baseResults.yearlyData[0]?.cashFlow / 12 || 0,
      adjusted: adjustedResults.yearlyData[0]?.cashFlow / 12 || 0,
      format: formatCurrency,
    },
    {
      label: 'Cash-on-Cash Return',
      base: baseResults.returnMetrics.cashOnCashReturn || 0,
      adjusted: adjustedResults.returnMetrics.cashOnCashReturn || 0,
      format: formatPercent,
    },
    {
      label: '10-Year Total Wealth',
      base: baseResults.yearlyData[baseResults.yearlyData.length - 1]?.totalWealth || 0,
      adjusted: adjustedResults.yearlyData[adjustedResults.yearlyData.length - 1]?.totalWealth || 0,
      format: (v: number) => formatCurrency(v, 0),
    },
    {
      label: '10-Year Equity',
      base: baseResults.yearlyData[baseResults.yearlyData.length - 1]?.equity || 0,
      adjusted: adjustedResults.yearlyData[adjustedResults.yearlyData.length - 1]?.equity || 0,
      format: (v: number) => formatCurrency(v, 0),
    },
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-full p-4 shadow-lg transition-all hover:scale-110 z-40"
      >
        <Sliders className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-900 dark:text-slate-100">What-If Analysis</CardTitle>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sliders */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Monthly Rent: {adjustments.rentDelta >= 0 ? '+' : ''}{adjustments.rentDelta}%
              </label>
              <input
                type="range"
                min="-50"
                max="50"
                step="1"
                value={adjustments.rentDelta}
                onChange={(e) => setAdjustments({ ...adjustments, rentDelta: Number(e.target.value) })}
                className="w-full accent-purple-600 dark:accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>-50%</span>
                <span>0%</span>
                <span>+50%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Appreciation Rate: {adjustments.appreciationDelta >= 0 ? '+' : ''}{adjustments.appreciationDelta}%
              </label>
              <input
                type="range"
                min="-5"
                max="5"
                step="0.5"
                value={adjustments.appreciationDelta}
                onChange={(e) => setAdjustments({ ...adjustments, appreciationDelta: Number(e.target.value) })}
                className="w-full accent-purple-600 dark:accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>-5%</span>
                <span>0%</span>
                <span>+5%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Expense Growth: {adjustments.expenseDelta >= 0 ? '+' : ''}{adjustments.expenseDelta}%
              </label>
              <input
                type="range"
                min="-3"
                max="3"
                step="0.5"
                value={adjustments.expenseDelta}
                onChange={(e) => setAdjustments({ ...adjustments, expenseDelta: Number(e.target.value) })}
                className="w-full accent-purple-600 dark:accent-purple-500"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>-3%</span>
                <span>0%</span>
                <span>+3%</span>
              </div>
            </div>
          </div>

          {/* Results Comparison */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-4">Impact Analysis</h3>
            <div className="space-y-3">
              {metrics.map((metric) => {
                const delta = metric.adjusted - metric.base;
                const percentChange = metric.base !== 0 ? (delta / Math.abs(metric.base)) * 100 : 0;

                return (
                  <div key={metric.label} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-b-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{metric.label}</span>
                    <div className="text-right">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs text-slate-500 dark:text-slate-400">{metric.format(metric.base)}</span>
                        <span className="text-lg font-bold text-slate-900 dark:text-slate-100">{metric.format(metric.adjusted)}</span>
                      </div>
                      <div className={`text-xs font-medium ${delta >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {delta >= 0 ? '+' : ''}{metric.format(delta)} ({percentChange >= 0 ? '+' : ''}{percentChange.toFixed(1)}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => setAdjustments({ rentDelta: 0, appreciationDelta: 0, expenseDelta: 0 })}
            className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            Reset All
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
