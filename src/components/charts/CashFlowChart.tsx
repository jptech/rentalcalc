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
  ReferenceLine,
  Label,
} from 'recharts';
import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';
import { useChartTheme } from '../../hooks/useChartTheme';

interface CashFlowChartProps {
  data: YearlyData[];
}

export function CashFlowChart({ data }: CashFlowChartProps) {
  const theme = useChartTheme();

  const chartData = data.map((year) => ({
    year: `Year ${year.year}`,
    cashFlow: Math.round(year.cashFlow),
    cumulativeCashFlow: Math.round(year.cumulativeCashFlow),
  }));

  // Custom bar color based on positive/negative
  const getBarColor = (value: number) => {
    return value >= 0 ? theme.colors.success : theme.colors.danger;
  };

  // Find when cash flow turns positive
  const breakEvenYear = chartData.findIndex(d => d.cashFlow > 0);

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.grid.stroke} />

          {/* Zero line */}
          <ReferenceLine y={0} stroke={theme.referenceLine.stroke} strokeDasharray="3 3" strokeWidth={1}>
            <Label value="Break-even" position="insideTopRight" fill={theme.label.fill} fontSize={12} />
          </ReferenceLine>

          {/* Mark when cash flow turns positive */}
          {breakEvenYear > 0 && (
            <ReferenceLine
              x={chartData[breakEvenYear]?.year}
              stroke={theme.colors.success}
              strokeDasharray="5 5"
              strokeWidth={2}
            >
              <Label value="Cash Flow Positive" position="top" fill={theme.colors.success} fontSize={12} />
            </ReferenceLine>
          )}
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
            stroke={theme.colors.primary}
            strokeWidth={3}
            name="Cumulative Cash Flow"
            dot={{ r: 4, fill: theme.colors.primary }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
