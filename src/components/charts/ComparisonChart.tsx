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
import { useChartTheme } from '../../hooks/useChartTheme';

interface ComparisonChartProps {
  analysis: OpportunityCostAnalysis;
}

export function ComparisonChart({ analysis }: ComparisonChartProps) {
  const theme = useChartTheme();
  const chartData = analysis.holdScenario.yearlyWealth.map((_, index) => ({
    year: `Year ${index + 1}`,
    hold: Math.round(analysis.holdScenario.yearlyWealth[index]),
    sell: Math.round(analysis.sellScenario.yearlyWealth[index]),
  }));

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid.stroke} />
          <XAxis
            dataKey="year"
            tick={theme.axis.tick}
            tickLine={theme.axis.tickLine}
          />
          <YAxis
            tick={theme.axis.tick}
            tickLine={theme.axis.tickLine}
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={theme.tooltip.contentStyle}
            labelStyle={theme.tooltip.labelStyle}
            itemStyle={theme.tooltip.itemStyle}
            formatter={(value: number) => [formatCurrency(value), '']}
          />
          <Legend
            wrapperStyle={theme.legend.wrapperStyle}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="hold"
            stroke={theme.colors.success}
            strokeWidth={3}
            name="Hold Property"
            dot={{ r: 4, fill: theme.colors.success }}
          />
          <Line
            type="monotone"
            dataKey="sell"
            stroke={theme.colors.primary}
            strokeWidth={3}
            name="Sell & Invest"
            dot={{ r: 4, fill: theme.colors.primary }}
            strokeDasharray="5 5"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
