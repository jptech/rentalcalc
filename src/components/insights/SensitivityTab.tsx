import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SensitivityAnalysis } from '../../types/property';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { SensitivityRangeChart } from '../charts/SensitivityRangeChart';

interface SensitivityTabProps {
  sensitivity: SensitivityAnalysis;
}

export function SensitivityTab({ sensitivity }: SensitivityTabProps) {
  if (!sensitivity.enabled) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        <p className="mb-2">Enable sensitivity ranges on key inputs to see scenario analysis.</p>
        <p className="text-sm">
          Go to Growth Projections or Tax & Opportunity sections and click the "Range" button.
        </p>
      </div>
    );
  }

  const { best, base, worst } = sensitivity.scenarios;

  const metrics = [
    {
      key: 'finalWealth',
      label: 'Final Net Wealth',
      format: (v: number) => formatCurrency(v, 0),
      getValue: (s: typeof best) => s.finalWealth,
    },
    {
      key: 'cashFlow',
      label: 'Total Cash Flow',
      format: (v: number) => formatCurrency(v, 0),
      getValue: (s: typeof best) => s.totalCashFlow,
    },
    {
      key: 'coC',
      label: 'Cash-on-Cash Return',
      format: (v: number) => formatPercent(v),
      getValue: (s: typeof best) => s.returnMetrics.cashOnCashReturn,
    },
    {
      key: 'totalReturn',
      label: 'Total Return (Ann.)',
      format: (v: number) => formatPercent(v),
      getValue: (s: typeof best) => s.returnMetrics.totalReturn,
    },
    {
      key: 'capRate',
      label: 'Cap Rate',
      format: (v: number) => formatPercent(v),
      getValue: (s: typeof best) => s.returnMetrics.capRate,
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-2">Sensitivity Analysis</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Compare best, base, and worst case scenarios based on your input ranges
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-emerald-200 dark:border-emerald-800/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <CardTitle className="text-emerald-900 dark:text-emerald-100">Best Case</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">Final Wealth</div>
                <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                  {formatCurrency(best.finalWealth, 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-emerald-700 dark:text-emerald-300">Total Return</div>
                <div className="text-lg font-semibold text-emerald-900 dark:text-emerald-100">
                  {formatPercent(best.returnMetrics.totalReturn)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 dark:border-blue-800/50 bg-blue-50/50 dark:bg-blue-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Minus className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-blue-900 dark:text-blue-100">Base Case</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Final Wealth</div>
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {formatCurrency(base.finalWealth, 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-blue-700 dark:text-blue-300">Total Return</div>
                <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                  {formatPercent(base.returnMetrics.totalReturn)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 dark:border-orange-800/50 bg-orange-50/50 dark:bg-orange-950/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <CardTitle className="text-orange-900 dark:text-orange-100">Worst Case</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Final Wealth</div>
                <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {formatCurrency(worst.finalWealth, 0)}
                </div>
              </div>
              <div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Total Return</div>
                <div className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                  {formatPercent(worst.returnMetrics.totalReturn)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wealth Projection Range Chart */}
      <Card className="bg-white dark:bg-slate-900/50">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
          <CardTitle className="text-slate-900 dark:text-slate-50">Wealth Projection with Confidence Interval</CardTitle>
        </CardHeader>
        <CardContent>
          <SensitivityRangeChart sensitivity={sensitivity} />
          <div className="mt-4 p-3 text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-700/50">
            <p>
              The shaded blue area represents the confidence interval between worst and best case scenarios.
              The solid blue line shows the base case projection, while the dashed lines indicate the range boundaries.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Comparison Table */}
      <Card className="bg-white dark:bg-slate-900/50">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
          <CardTitle className="text-slate-900 dark:text-slate-50">Detailed Metrics Comparison</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700/50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Metric</th>
                  <th className="text-right py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-300">Best Case</th>
                  <th className="text-right py-3 px-4 font-semibold text-blue-700 dark:text-blue-300">Base Case</th>
                  <th className="text-right py-3 px-4 font-semibold text-orange-700 dark:text-orange-300">Worst Case</th>
                  <th className="text-right py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Range</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {metrics.map((metric, idx) => {
                  const bestVal = metric.getValue(best);
                  const baseVal = metric.getValue(base);
                  const worstVal = metric.getValue(worst);
                  const range = bestVal - worstVal;

                  return (
                    <tr
                      key={metric.key}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-800/20'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-50">{metric.label}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-700 dark:text-emerald-300 font-semibold">
                        {metric.format(bestVal)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-blue-700 dark:text-blue-300 font-semibold">
                        {metric.format(baseVal)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-orange-700 dark:text-orange-300 font-semibold">
                        {metric.format(worstVal)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600 dark:text-slate-200">
                        {metric.format(Math.abs(range))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 mx-4 mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-blue-800/50">
            <strong>Note:</strong> These scenarios use the min, base, and max values from your enabled
            input ranges. The "Range" column shows the spread between best and worst case outcomes.
          </div>
        </CardContent>
      </Card>

      {/* Wealth Over Time Comparison */}
      <Card className="bg-white dark:bg-slate-900/50">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
          <CardTitle className="text-slate-900 dark:text-slate-50">Wealth Projection by Scenario</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700/50">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">Year</th>
                  <th className="text-right py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-300">Best Case</th>
                  <th className="text-right py-3 px-4 font-semibold text-blue-700 dark:text-blue-300">Base Case</th>
                  <th className="text-right py-3 px-4 font-semibold text-orange-700 dark:text-orange-300">Worst Case</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {base.yearlyData.map((_, idx) => {
                  const year = idx + 1;
                  const bestWealth = best.yearlyData[idx]?.totalWealth || 0;
                  const baseWealth = base.yearlyData[idx]?.totalWealth || 0;
                  const worstWealth = worst.yearlyData[idx]?.totalWealth || 0;

                  // Only show every year for first 5 years, then every 5 years
                  if (year > 5 && year % 5 !== 0 && year !== best.yearlyData.length) {
                    return null;
                  }

                  return (
                    <tr
                      key={year}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        idx % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-800/20'
                      }`}
                    >
                      <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-50">Year {year}</td>
                      <td className="py-3 px-4 text-right tabular-nums text-emerald-700 dark:text-emerald-300">
                        {formatCurrency(bestWealth, 0)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-blue-700 dark:text-blue-300">
                        {formatCurrency(baseWealth, 0)}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-orange-700 dark:text-orange-300">
                        {formatCurrency(worstWealth, 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
