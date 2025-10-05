import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface DataTableProps {
  data: YearlyData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="space-y-4">
      <Card className="bg-white dark:bg-slate-900/50">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/30">
          <CardTitle className="text-slate-900 dark:text-slate-50">Year-by-Year Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Year</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Property Value</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Loan Balance</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Equity</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Gross Income</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Total Expenses</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Mortgage (P+I)</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Cash Flow</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Cumulative CF</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Tax Savings</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Total Wealth</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">YoY Gain</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {data.map((year, index) => {
                  const previousWealth = index > 0 ? data[index - 1].totalWealth : 0;
                  const yoyGain = year.totalWealth - previousWealth;

                  return (
                  <tr
                    key={year.year}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                      index % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-800/20'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">{year.year}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                      {formatCurrency(year.propertyValue, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                      {formatCurrency(year.loanBalance, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-blue-600 dark:text-blue-300">
                      {formatCurrency(year.equity, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                      {formatCurrency(year.effectiveIncome, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                      {formatCurrency(year.totalExpenses, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                      {formatCurrency(year.mortgagePayment, 0)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-medium ${
                      year.cashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                    }`}>
                      {formatCurrency(year.cashFlow, 0)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums ${
                      year.cumulativeCashFlow >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                    }`}>
                      {formatCurrency(year.cumulativeCashFlow, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-purple-600 dark:text-purple-300">
                      {formatCurrency(year.cumulativeTaxSavings, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-900 dark:text-slate-50">
                      {formatCurrency(year.totalWealth, 0)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-medium ${
                      yoyGain >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                    }`}>
                      {index === 0 ? '—' : formatCurrency(yoyGain, 0)}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Summary statistics at the bottom */}
          <div className="border-t-2 border-slate-200 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/60 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs tracking-wide text-slate-500 dark:text-slate-400 mb-1">Final Equity</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-300 tabular-nums">
                  {formatCurrency(data[data.length - 1]?.equity || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide text-slate-500 dark:text-slate-400 mb-1">Total Cash Flow</p>
                <p className={`text-lg font-bold tabular-nums ${
                  (data[data.length - 1]?.cumulativeCashFlow || 0) >= 0 ? 'text-emerald-600 dark:text-emerald-300' : 'text-rose-600 dark:text-rose-300'
                }`}>
                  {formatCurrency(data[data.length - 1]?.cumulativeCashFlow || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide text-slate-500 dark:text-slate-400 mb-1">Total Tax Savings</p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-300 tabular-nums">
                  {formatCurrency(data[data.length - 1]?.cumulativeTaxSavings || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs tracking-wide text-slate-500 dark:text-slate-400 mb-1">Final Net Wealth</p>
                <p className="text-lg font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                  {formatCurrency(data[data.length - 1]?.totalWealth || 0, 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional details expandable section */}
      <details className="group">
        <summary className="cursor-pointer bg-white dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700/50 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
          <span className="font-medium text-slate-900 dark:text-slate-50">
            📊 View Detailed Expense Breakdown by Year
          </span>
        </summary>
        <Card className="mt-2 bg-white dark:bg-slate-900/50">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/80 border-b-2 border-slate-200 dark:border-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-200">Year</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Property Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Insurance</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">HOA Fees</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Utilities</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Maintenance</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Management</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">CapEx</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Principal Paid</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-200">Interest Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {data.map((year, index) => (
                    <tr
                      key={year.year}
                      className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors ${
                        index % 2 === 0 ? 'bg-white dark:bg-slate-900/30' : 'bg-slate-50/50 dark:bg-slate-800/20'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-50">{year.year}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.propertyTax, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.insurance, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.hoaFees, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.utilities, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.maintenance, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.management, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.capex, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-blue-600 dark:text-blue-300">
                        {formatCurrency(year.principalPaid, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700 dark:text-slate-200">
                        {formatCurrency(year.interestPaid, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </details>
    </div>
  );
}
