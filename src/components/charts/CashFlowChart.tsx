import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';

interface CashFlowChartProps {
  data: YearlyData[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const chartData = data.map((year) => ({
    year: `Year ${year.year}`,
    cashFlow: Math.round(year.cashFlow),
    cumulativeCashFlow: Math.round(year.cumulativeCashFlow),
  }));

  // Custom bar color based on positive/negative
  const getBarColor = (value: number) => {
    return value >= 0 ? '#10b981' : '#ef4444'; // green for positive, red for negative
  };

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
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
          <Bar
            dataKey="cashFlow"
            name="Annual Cash Flow"
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getBarColor(entry.cashFlow)}
              />
            ))}
          </Bar>
          <Line
            type="monotone"
            dataKey="cumulativeCashFlow"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Cumulative Cash Flow"
            dot={{ r: 4, fill: '#3b82f6' }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
