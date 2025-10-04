import { DollarSign, TrendingUp, Home, Scale, AlertTriangle } from 'lucide-react';
import type { CalculationResults } from '../../types/property';
import { MetricCard } from './MetricCard';
import { formatCurrency, formatPercent } from '../../lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface InsightsTabProps {
  results: CalculationResults;
}

export function InsightsTab({ results }: InsightsTabProps) {
  const { yearlyData, returnMetrics, opportunityCost, totalInvestment } = results;

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
          title="Cash-on-Cash Return"
          value={formatPercent(returnMetrics.cashOnCashReturn)}
          subtitle={`On ${formatCurrency(totalInvestment)} investment`}
          icon={TrendingUp}
          variant={returnMetrics.cashOnCashReturn >= 8 ? 'success' : returnMetrics.cashOnCashReturn >= 4 ? 'default' : 'warning'}
        >
          <div className="text-xs text-slate-600">
            <div>Year 1 cash flow: {formatCurrency(firstYear.cashFlow)}</div>
            <div className="mt-1 text-slate-500">
              {returnMetrics.cashOnCashReturn >= 8 && '✓ Excellent return'}
              {returnMetrics.cashOnCashReturn >= 4 && returnMetrics.cashOnCashReturn < 8 && '○ Good return'}
              {returnMetrics.cashOnCashReturn < 4 && '⚠ Below typical target (8%+)'}
            </div>
          </div>
        </MetricCard>

        <MetricCard
          title="10-Year Net Wealth"
          value={formatCurrency(lastYear.totalWealth, 0)}
          subtitle={`Equity + Cash Flow + Tax Savings`}
          icon={Home}
          variant="default"
        >
          <div className="text-xs text-slate-600 space-y-0.5">
            <div className="flex justify-between">
              <span>Equity:</span>
              <span className="font-medium">{formatCurrency(lastYear.equity, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Cumulative Cash Flow:</span>
              <span className="font-medium">{formatCurrency(lastYear.cumulativeCashFlow, 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax Savings:</span>
              <span className="font-medium">{formatCurrency(lastYear.cumulativeTaxSavings, 0)}</span>
            </div>
          </div>
        </MetricCard>

        <MetricCard
          title="Total Return (Annualized)"
          value={formatPercent(returnMetrics.totalReturn)}
          subtitle={`Over ${yearlyData.length} years`}
          icon={TrendingUp}
          variant={returnMetrics.totalReturn >= 10 ? 'success' : returnMetrics.totalReturn >= 5 ? 'default' : 'warning'}
        >
          <div className="text-xs text-slate-600">
            <div>Cap Rate: {formatPercent(returnMetrics.capRate)}</div>
            <div>Total ROI: {formatPercent(returnMetrics.roi)}</div>
          </div>
        </MetricCard>
      </div>

      {/* Hold vs Sell Decision */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <Scale className="w-6 h-6 text-blue-600" />
            <CardTitle>Hold vs. Sell Decision</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Recommendation</p>
                <p className="text-2xl font-bold">
                  {opportunityCost.recommendation === 'hold' ? (
                    <span className="text-emerald-600">HOLD Property</span>
                  ) : (
                    <span className="text-blue-600">SELL & Invest</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 mb-1">Wealth Difference</p>
                <p className={`text-2xl font-bold tabular-nums ${
                  opportunityCost.wealthDifference > 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {opportunityCost.wealthDifference > 0 ? '+' : ''}
                  {formatCurrency(opportunityCost.wealthDifference, 0)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Hold Property</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">
                  {formatCurrency(opportunityCost.holdScenario.finalWealth, 0)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  After {yearlyData.length} years
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-2">Sell & Invest</p>
                <p className="text-xl font-bold text-slate-900 tabular-nums">
                  {formatCurrency(opportunityCost.sellScenario.finalWealth, 0)}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  At {formatPercent(results.yearlyData[0] ? returnMetrics.totalReturn : 0, 1)} return
                </p>
              </div>
            </div>

            {opportunityCost.breakEvenYear && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  💡 <strong>Break-even point:</strong> Holding the property becomes more profitable than selling in year {opportunityCost.breakEvenYear}.
                </p>
              </div>
            )}

            <div className="text-xs text-slate-500 space-y-1">
              <p>• Assumes {formatPercent(results.yearlyData[0] ? returnMetrics.totalReturn : 0, 1)} alternative investment return</p>
              <p>• Selling costs: {formatPercent(yearlyData[0] ? 6 : 0)} of property value</p>
              <p>• Projections are estimates, not guarantees</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Indicators */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <CardTitle>Risk Factors</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {firstYear.cashFlow < 0 && (
              <div className="flex items-start space-x-3 p-3 bg-rose-50 border border-rose-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-rose-900">Negative Cash Flow</p>
                  <p className="text-xs text-rose-700 mt-1">
                    Property has negative cash flow in Year 1. You'll need reserves to cover the shortfall.
                  </p>
                </div>
              </div>
            )}

            {returnMetrics.cashOnCashReturn < 4 && (
              <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Low Cash-on-Cash Return</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Return is below typical investor target of 8%+. Consider negotiating better terms.
                  </p>
                </div>
              </div>
            )}

            {yearlyData[0].vacancy / yearlyData[0].grossRent > 0.08 && yearlyData[0].grossRent > 0 && (
              <div className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">High Vacancy Rate</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Vacancy rate above 8% is high. Ensure this matches local market conditions.
                  </p>
                </div>
              </div>
            )}

            {firstYear.cashFlow >= 0 && returnMetrics.cashOnCashReturn >= 8 && (
              <div className="flex items-start space-x-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-2xl">✓</span>
                <div>
                  <p className="text-sm font-medium text-emerald-900">Strong Investment Metrics</p>
                  <p className="text-xs text-emerald-700 mt-1">
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
