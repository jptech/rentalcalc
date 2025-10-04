import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';

interface WealthBreakdownChartProps {
  data: YearlyData[];
}

export function WealthBreakdownChart({ data }: WealthBreakdownChartProps) {
  const chartData = data
    .filter((_, index) => index % Math.max(1, Math.floor(data.length / 10)) === 0 || index === data.length - 1)
    .map((year) => ({
      year: `Year ${year.year}`,
      equity: Math.round(year.equity),
      cashFlow: Math.round(year.cumulativeCashFlow),
      taxSavings: Math.round(year.cumulativeTaxSavings),
    }));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickLine={{ stroke: '#cbd5e1' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
            }}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <Bar dataKey="equity" stackId="a" fill="#3b82f6" name="Equity" radius={[0, 0, 0, 0]} />
          <Bar dataKey="cashFlow" stackId="a" fill="#10b981" name="Cash Flow" radius={[0, 0, 0, 0]} />
          <Bar dataKey="taxSavings" stackId="a" fill="#8b5cf6" name="Tax Savings" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
