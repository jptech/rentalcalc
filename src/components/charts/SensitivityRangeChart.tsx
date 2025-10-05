import {
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from 'recharts';
import type { SensitivityAnalysis } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';

interface SensitivityRangeChartProps {
  sensitivity: SensitivityAnalysis;
}

export function SensitivityRangeChart({ sensitivity }: SensitivityRangeChartProps) {
  const { best, base, worst } = sensitivity.scenarios;

  // Prepare data for the chart
  const chartData = base.yearlyData.map((baseYear, index) => {
    const bestYear = best.yearlyData[index];
    const worstYear = worst.yearlyData[index];

    return {
      year: `Y${baseYear.year}`,
      best: bestYear?.totalWealth || 0,
      base: baseYear.totalWealth,
      worst: worstYear?.totalWealth || 0,
      // For area chart - range between best and worst
      range: [worstYear?.totalWealth || 0, bestYear?.totalWealth || 0],
    };
  });

  return (
    <div className="w-full h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#64748b"
            style={{ fontSize: '12px' }}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px',
            }}
            formatter={(value: number) => [formatCurrency(value, 0), '']}
            labelStyle={{ fontWeight: 600, marginBottom: '8px' }}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="line"
          />

          {/* Confidence interval area */}
          <Area
            type="monotone"
            dataKey="range"
            fill="#93c5fd"
            stroke="none"
            fillOpacity={0.3}
            name="Confidence Range"
          />

          {/* Best case line */}
          <Line
            type="monotone"
            dataKey="best"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            name="Best Case"
            strokeDasharray="5 5"
          />

          {/* Base case line */}
          <Line
            type="monotone"
            dataKey="base"
            stroke="#2563eb"
            strokeWidth={3}
            dot={false}
            name="Base Case"
          />

          {/* Worst case line */}
          <Line
            type="monotone"
            dataKey="worst"
            stroke="#f97316"
            strokeWidth={2}
            dot={false}
            name="Worst Case"
            strokeDasharray="5 5"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
