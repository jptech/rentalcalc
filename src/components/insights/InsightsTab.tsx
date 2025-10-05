import { DollarSign, TrendingUp, Home, Scale, AlertTriangle } from 'lucide-react';
import type { CalculationResults } from '../../types/property';
import { MetricCard } from './MetricCard';
import { Gauge } from '../ui/Gauge';
import { GlossaryTerm } from '../ui/GlossaryTerm';
import { CalculationTooltip } from '../ui/CalculationTooltip';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface InsightsTabProps {
  results: CalculationResults;
}

export function InsightsTab({ results }: InsightsTabProps) {
  const { yearlyData, returnMetrics, opportunityCost, totalInvestment, inputs } = results;

  if (yearlyData.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        No data available. Please adjust inputs.
      </div>
    );
  }

  const firstYear = yearlyData[0];
  const lastYear = yearlyData[yearlyData.length - 1];

  return (
    <div className="space-y-6">
      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MetricCard
          title="Monthly Cash Flow"
          value={formatCurrency(firstYear.cashFlow / 12)}
          subtitle="Year 1 Average"
          icon={DollarSign}
          variant={firstYear.cashFlow >= 0 ? 'success' : 'danger'}
        >
          <div className="text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Income:</span>
              <span className="font-medium">{formatCurrency(firstYear.effectiveIncome / 12)}</span>
            </div>
            <div className="flex justify-between">
              <span>Expenses:</span>
              <span className="font-medium">{formatCurrency(firstYear.totalExpenses / 12)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mortgage:</span>
              <span className="font-medium">{formatCurrency(firstYear.mortgagePayment / 12)}</span>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          title={<GlossaryTerm term="CoC Return" />}
          value={
            <CalculationTooltip
              value={returnMetrics.cashOnCashReturn}
              format={formatPercent}
              calculation={{
                formula: 'Annual Cash Flow ÷ Total Investment',
                breakdown: [
                  { label: 'Year 1 Cash Flow', value: firstYear.cashFlow },
                  { label: 'Total Investment', value: totalInvestment },
                ],
              }}
            />
          }
          subtitle={`On ${formatCurrency(totalInvestment)} investment`}
          icon={TrendingUp}
          variant={returnMetrics.cashOnCashReturn >= 8 ? 'success' : returnMetrics.cashOnCashReturn >= 4 ? 'default' : 'warning'}
        >
          <div className="space-y-3">
            <div className="text-xs text-slate-600 dark:text-slate-400">
              <div>Year 1 cash flow: {formatCurrency(firstYear.cashFlow)}</div>
            </div>
            <Gauge
              value={returnMetrics.cashOnCashReturn}
              target={12}
              label="vs 12% target"
            />
          </div>
        </MetricCard>

        <MetricCard
          title="10-Year Net Wealth"
          value={
            <CalculationTooltip
              value={lastYear.totalWealth}
              format={(v) => formatCurrency(v, 0)}
              calculation={{
                formula: 'Equity + Cash Flow + Tax Savings',
                breakdown: [
                  { label: 'Equity (value - loan)', value: lastYear.equity },
                  { label: 'Cash Flow (10 years)', value: lastYear.cumulativeCashFlow },
                  { label: 'Tax Savings (10 years)', value: lastYear.cumulativeTaxSavings },
                ],
              }}
            />
          }
          subtitle="Total wealth after 10 years"
          icon={Home}
          variant="default"
        >
          <div className="text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
            <div className="flex justify-between">
              <span><GlossaryTerm term="Equity" />:</span>
              <span className="font-medium">{formatCurrency(lastYear.equity, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cash Flow:</span>
              <span className="font-medium">{formatCurrency(lastYear.cumulativeCashFlow, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span><GlossaryTerm term="Tax Savings" />:</span>
              <span className="font-medium">{formatCurrency(lastYear.cumulativeTaxSavings, 0)}</span>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          title={<GlossaryTerm term="Total Return" />}
          value={formatPercent(returnMetrics.totalReturn)}
          subtitle={`Over ${yearlyData.length} years`}
          icon={TrendingUp}
          variant={returnMetrics.totalReturn >= 10 ? 'success' : returnMetrics.totalReturn >= 5 ? 'default' : 'warning'}
        >
          <div className="text-xs text-slate-600 dark:text-slate-400">
            <div><GlossaryTerm term="Cap Rate" />: {formatPercent(returnMetrics.capRate)}</div>
            <div>Total ROI: {formatPercent(returnMetrics.roi)}</div>
          </div>
        </MetricCard>
      </div>

      {/* Hold vs Sell Decision */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Hold vs. Sell Decision</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Recommendation</p>
                <p className="text-2xl font-bold">
                  {opportunityCost.recommendation === 'hold' ? (
                    <span className="text-emerald-600 dark:text-emerald-400">HOLD Property</span>
                  ) : (
                    <span className="text-blue-600 dark:text-blue-400">SELL & Invest</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Wealth Difference</p>
                <p className={`text-2xl font-bold tabular-nums ${
                  opportunityCost.wealthDifference > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}>
                  {opportunityCost.wealthDifference > 0 ? '+' : ''}
                  {formatCurrency(opportunityCost.wealthDifference, 0)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Hold Property</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatCurrency(opportunityCost.holdScenario.finalWealth, 0)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  After {yearlyData.length} years
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">Sell & Invest</p>
                <p className="text-xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatCurrency(opportunityCost.sellScenario.finalWealth, 0)}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                  At {formatPercent(inputs.alternativeReturn, 1)} return
                </p>
              </div>
            </div>

            {opportunityCost.breakEvenYear && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-100">
                  💡 <strong>Break-even point:</strong> Holding the property becomes more profitable than selling in year {opportunityCost.breakEvenYear}.
                </p>
              </div>
            )}

            <div className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
              <p>• Assumes {formatPercent(inputs.alternativeReturn, 1)} alternative investment return</p>
              <p>• Selling costs: {formatPercent(inputs.sellingCosts, 1)} of property value</p>
              <p>• Projections are estimates, not guarantees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Indicators */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-800">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500" />
            <CardTitle className="text-slate-900 dark:text-slate-100">Risk Factors</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {firstYear.cashFlow < 0 && (
              <div className="flex items-start space-x-3 p-3 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-rose-900 dark:text-rose-100">Negative Cash Flow</p>
                  <p className="text-xs text-rose-700 dark:text-rose-300 mt-1">
                    Property has negative cash flow in Year 1. You'll need reserves to cover the shortfall.
                  </p>
                </div>
              </div>
            )}

            {returnMetrics.cashOnCashReturn < 4 && (
              <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Low Cash-on-Cash Return</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Return is below typical investor target of 8%+. Consider negotiating better terms.
                  </p>
                </div>
              </div>
            )}

            {yearlyData[0].vacancy / yearlyData[0].grossRent > 0.08 && yearlyData[0].grossRent > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900 dark:text-amber-100">High Vacancy Rate</p>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                    Vacancy rate above 8% is high. Ensure this matches local market conditions.
                  </p>
                </div>
              </div>
            )}

            {firstYear.cashFlow >= 0 && returnMetrics.cashOnCashReturn >= 8 && (
              <div className="flex items-start space-x-3 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-sm font-medium text-emerald-900 dark:text-emerald-100">Strong Investment Metrics</p>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">
                    Positive cash flow with good returns. Property meets typical investment criteria.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
