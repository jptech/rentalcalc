import { formatCurrency } from '../../lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import type { YearlyData } from '../../types/property';

interface CashFlowCalendarProps {
  yearData: YearlyData;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function CashFlowCalendar({ yearData }: CashFlowCalendarProps) {
  // Calculate monthly breakdown (simplified - in reality you'd track monthly variations)
  const monthlyIncome = yearData.effectiveIncome / 12;
  const monthlyExpenses = yearData.totalExpenses / 12;
  const monthlyMortgage = yearData.mortgagePayment / 12;

  // Simulate some variation (you can enhance this with actual monthly data)
  const months = MONTHS.map((name, index) => {
    // Add small random variation for demonstration
    const variation = 1 + (Math.sin(index) * 0.05); // ±5% seasonal variation

    return {
      name,
      income: monthlyIncome * variation,
      expenses: monthlyExpenses * variation,
      mortgage: monthlyMortgage,
      cashFlow: (monthlyIncome - monthlyExpenses - monthlyMortgage) * variation,
    };
  });

  // Calculate cumulative
  let cumulative = 0;
  const monthsWithCumulative = months.map(month => {
    cumulative += month.cashFlow;
    return { ...month, cumulative };
  });

  return (
    <Card className="bg-white dark:bg-slate-900/50">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
        <CardTitle className="text-slate-900 dark:text-slate-50">Monthly Cash Flow Calendar - Year 1</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Month</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Income</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Expenses</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Mortgage</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Cash Flow</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Cumulative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {monthsWithCumulative.map((month, index) => (
                <tr
                  key={month.name}
                  className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                    index % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-800/20'
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">{month.name}</td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                    {formatCurrency(month.income, 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                    {formatCurrency(month.expenses, 0)}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                    {formatCurrency(month.mortgage, 0)}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums font-medium ${
                    month.cashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                  }`}>
                    {formatCurrency(month.cashFlow, 0)}
                  </td>
                  <td className={`px-4 py-3 text-right tabular-nums font-semibold ${
                    month.cumulative >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                  }`}>
                    {formatCurrency(month.cumulative, 0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-slate-700 dark:text-slate-200 border border-blue-200 dark:border-blue-800/50">
          <strong>Note:</strong> This calendar shows estimated monthly breakdown. Enable seasonal tracking in settings for more accurate month-to-month variations.
        </div>
      </CardContent>
    </Card>
  );
}
