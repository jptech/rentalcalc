import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';

interface EquityChartProps {
  data: YearlyData[];
}

export function EquityChart({ data }: EquityChartProps) {
  const chartData = data.map((year) => ({
    year: `Year ${year.year}`,
    propertyValue: Math.round(year.propertyValue),
    loanBalance: Math.round(year.loanBalance),
    equity: Math.round(year.equity),
  }));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorPropertyValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorLoanBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.2} />
            </linearGradient>
          </defs>
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
            formatter={(value: number) => formatCurrency(value)}
          />
          <Area
            type="monotone"
            dataKey="propertyValue"
            stackId="1"
            stroke="#3b82f6"
            fill="url(#colorPropertyValue)"
            name="Property Value"
          />
          <Area
            type="monotone"
            dataKey="equity"
            stackId="2"
            stroke="#10b981"
            fill="url(#colorEquity)"
            name="Equity"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
