import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { OpportunityCostAnalysis } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';

interface ComparisonChartProps {
  analysis: OpportunityCostAnalysis;
}

export function ComparisonChart({ analysis }: ComparisonChartProps) {
  const chartData = analysis.holdScenario.yearlyWealth.map((_, index) => ({
    year: `Year ${index + 1}`,
    hold: Math.round(analysis.holdScenario.yearlyWealth[index]),
    sell: Math.round(analysis.sellScenario.yearlyWealth[index]),
  }));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="hold"
            stroke="#10b981"
            strokeWidth={3}
            name="Hold Property"
            dot={{ r: 4, fill: '#10b981' }}
          />
          <Line
            type="monotone"
            dataKey="sell"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Sell & Invest"
            dot={{ r: 4, fill: '#3b82f6' }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
