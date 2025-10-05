import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';
import { useChartTheme } from '../../hooks/useChartTheme';

interface EquityChartProps {
  data: YearlyData[];
}

export function EquityChart({ data }: EquityChartProps) {
  const theme = useChartTheme();
  const chartData = data.map((year) => ({
    year: `Year ${year.year}`,
    yearNum: year.year,
    propertyValue: Math.round(year.propertyValue),
    loanBalance: Math.round(year.loanBalance),
    equity: Math.round(year.equity),
  }));

  // Find when mortgage is paid off (loan balance becomes 0)
  const payoffYear = chartData.find(d => d.loanBalance === 0);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          {/* Mortgage paid off marker */}
          {payoffYear && (
            <ReferenceLine
              x={payoffYear.year}
              stroke={theme.colors.success}
              strokeDasharray="5 5"
              strokeWidth={2}
            >
              <Label value="Mortgage Paid Off" position="top" fill={theme.colors.success} fontSize={12} />
            </ReferenceLine>
          )}
          <defs>
            <linearGradient id="colorPropertyValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.colors.primary} stopOpacity={0.8} />
              <stop offset="95%" stopColor={theme.colors.primary} stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.colors.success} stopOpacity={0.8} />
              <stop offset="95%" stopColor={theme.colors.success} stopOpacity={0.2} />
            </linearGradient>
          </defs>
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
            formatter={(value: number) => formatCurrency(value)}
          />
          <Area
            type="monotone"
            dataKey="propertyValue"
            stackId="1"
            stroke={theme.colors.primary}
            fill="url(#colorPropertyValue)"
            name="Property Value"
          />
          <Area
            type="monotone"
            dataKey="equity"
            stackId="2"
            stroke={theme.colors.success}
            fill="url(#colorEquity)"
            name="Equity"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
