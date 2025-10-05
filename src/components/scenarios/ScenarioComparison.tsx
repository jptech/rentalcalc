import { X } from 'lucide-react';
import type { SavedScenario } from '../../types/scenario';
import type { CalculationResults } from '../../types/property';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { formatCurrency, formatPercent } from '../../lib/formatters';

interface ScenarioComparisonProps {
  scenarios: Array<{
    scenario: SavedScenario;
    results: CalculationResults;
  }>;
  onClose: () => void;
}

export function ScenarioComparison({ scenarios, onClose }: ScenarioComparisonProps) {
  if (scenarios.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scenario Comparison</CardTitle>
              <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600">No scenarios selected for comparison.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const metrics = [
    { key: 'monthlyFlow', label: 'Monthly Cash Flow (Y1)', format: (v: number) => formatCurrency(v / 12) },
    { key: 'coC', label: 'Cash-on-Cash Return', format: (v: number) => formatPercent(v) },
    { key: 'capRate', label: 'Cap Rate', format: (v: number) => formatPercent(v) },
    { key: 'totalReturn', label: 'Total Return (Ann.)', format: (v: number) => formatPercent(v) },
    { key: 'finalWealth', label: '10-Year Net Wealth', format: (v: number) => formatCurrency(v, 0) },
    { key: 'equity', label: 'Final Equity', format: (v: number) => formatCurrency(v, 0) },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-6xl my-8">
        <CardHeader className="sticky top-0 bg-white z-10 border-b">
          <div className="flex items-center justify-between">
            <CardTitle>Scenario Comparison</CardTitle>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-4 font-semibold text-slate-700">Metric</th>
                  {scenarios.map(({ scenario }) => (
                    <th key={scenario.id} className="text-right py-3 px-4 font-semibold text-slate-700">
                      {scenario.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((metric, idx) => {
                  const values = scenarios.map(({ results }) => {
                    const firstYear = results.yearlyData[0];
                    const lastYear = results.yearlyData[results.yearlyData.length - 1];

                    switch (metric.key) {
                      case 'monthlyFlow':
                        return firstYear?.cashFlow || 0;
                      case 'coC':
                        return results.returnMetrics.cashOnCashReturn;
                      case 'capRate':
                        return results.returnMetrics.capRate;
                      case 'totalReturn':
                        return results.returnMetrics.totalReturn;
                      case 'finalWealth':
                        return lastYear?.totalWealth || 0;
                      case 'equity':
                        return lastYear?.equity || 0;
                      default:
                        return 0;
                    }
                  });

                  const maxValue = Math.max(...values);
                  const minValue = Math.min(...values);

                  return (
                    <tr
                      key={metric.key}
                      className={`border-b border-slate-100 ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}`}
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">{metric.label}</td>
                      {values.map((value, i) => {
                        const isBest = values.length > 1 && value === maxValue && maxValue !== minValue;
                        const isWorst = values.length > 1 && value === minValue && maxValue !== minValue;

                        return (
                          <td
                            key={i}
                            className={`py-3 px-4 text-right tabular-nums ${
                              isBest
                                ? 'font-bold text-emerald-600'
                                : isWorst
                                ? 'text-slate-500'
                                : 'text-slate-900'
                            }`}
                          >
                            {metric.format(value)}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Property Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scenarios.map(({ scenario }) => (
                <div key={scenario.id} className="bg-slate-50 rounded-lg p-4">
                  <h5 className="font-semibold text-slate-900 mb-2">{scenario.name}</h5>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Property Value:</span>
                      <span className="font-medium">{formatCurrency(scenario.inputs.propertyValue, 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Down Payment:</span>
                      <span className="font-medium">{formatPercent(scenario.inputs.downPaymentPercent)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Interest Rate:</span>
                      <span className="font-medium">{formatPercent(scenario.inputs.interestRate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Rent:</span>
                      <span className="font-medium">{formatCurrency(scenario.inputs.monthlyRent, 0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button onClick={onClose} variant="primary">
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
