import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface DataTableProps {
  data: YearlyData[];
}

export function DataTable({ data }: DataTableProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
          <CardTitle>Year-by-Year Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-100 border-b-2 border-slate-200 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-slate-700">Year</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Property Value</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Loan Balance</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Equity</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Gross Income</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Total Expenses</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Mortgage (P+I)</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Cash Flow</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Cumulative CF</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Tax Savings</th>
                  <th className="px-4 py-3 text-right font-semibold text-slate-700">Total Wealth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {data.map((year, index) => (
                  <tr
                    key={year.year}
                    className={`hover:bg-slate-50 transition-colors ${
                      index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">{year.year}</td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(year.propertyValue, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(year.loanBalance, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-medium text-blue-600">
                      {formatCurrency(year.equity, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(year.effectiveIncome, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(year.totalExpenses, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                      {formatCurrency(year.mortgagePayment, 0)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums font-medium ${
                      year.cashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {formatCurrency(year.cashFlow, 0)}
                    </td>
                    <td className={`px-4 py-3 text-right tabular-nums ${
                      year.cumulativeCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'
                    }`}>
                      {formatCurrency(year.cumulativeCashFlow, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-purple-600">
                      {formatCurrency(year.cumulativeTaxSavings, 0)}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold text-slate-900">
                      {formatCurrency(year.totalWealth, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary statistics at the bottom */}
          <div className="border-t-2 border-slate-200 bg-slate-50 p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Final Equity</p>
                <p className="text-lg font-bold text-blue-600 tabular-nums">
                  {formatCurrency(data[data.length - 1]?.equity || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Total Cash Flow</p>
                <p className={`text-lg font-bold tabular-nums ${
                  (data[data.length - 1]?.cumulativeCashFlow || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {formatCurrency(data[data.length - 1]?.cumulativeCashFlow || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Total Tax Savings</p>
                <p className="text-lg font-bold text-purple-600 tabular-nums">
                  {formatCurrency(data[data.length - 1]?.cumulativeTaxSavings || 0, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Final Net Wealth</p>
                <p className="text-lg font-bold text-slate-900 tabular-nums">
                  {formatCurrency(data[data.length - 1]?.totalWealth || 0, 0)}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional details expandable section */}
      <details className="group">
        <summary className="cursor-pointer bg-white rounded-lg border border-slate-200 px-4 py-3 hover:bg-slate-50 transition-colors">
          <span className="font-medium text-slate-900">
            📊 View Detailed Expense Breakdown by Year
          </span>
        </summary>
        <Card className="mt-2">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-slate-700">Year</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Property Tax</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Insurance</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">HOA Fees</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Utilities</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Maintenance</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Management</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">CapEx</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Principal Paid</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-700">Interest Paid</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {data.map((year, index) => (
                    <tr
                      key={year.year}
                      className={`hover:bg-slate-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">{year.year}</td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.propertyTax, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.insurance, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.hoaFees, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.utilities, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.maintenance, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.management, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatCurrency(year.capex, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-blue-600">
                        {formatCurrency(year.principalPaid, 0)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-slate-700">
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
