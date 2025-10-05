import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { YearlyData } from '../../types/property';
import { formatCurrency } from '../../lib/formatters';

interface WealthBreakdownChartProps {
  data: YearlyData[];
}

export function WealthBreakdownChart({ data }: WealthBreakdownChartProps) {
  const chartData = data
    .filter((_, index) => index % Math.max(1, Math.floor(data.length / 10)) === 0 || index === data.length - 1)
    .map((year) => {
      const cumulativeCashFlow = year.cumulativeCashFlow;

      return {
        year: `Year ${year.year}`,
        equity: Math.round(year.equity),
        // Separate positive and negative cash flow for better visualization
        positiveCashFlow: cumulativeCashFlow > 0 ? Math.round(cumulativeCashFlow) : 0,
        negativeCashFlow: cumulativeCashFlow < 0 ? Math.round(cumulativeCashFlow) : 0,
        taxSavings: Math.round(year.cumulativeTaxSavings),
        // For tooltip - always show the actual cash flow value
        actualCashFlow: Math.round(cumulativeCashFlow),
      };
    });

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
            formatter={(value: number, name: string) => {
              // Show actual cash flow value in tooltip instead of positive/negative split
              if (name === 'Positive Cash Flow' || name === 'Negative Cash Flow') {
                const entry = chartData.find(d => d.year === (value as any).year);
                return [formatCurrency(entry?.actualCashFlow || value), 'Cumulative Cash Flow'];
              }
              return [formatCurrency(value), name];
            }}
            labelFormatter={(label) => label}
          />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            iconType="square"
          />
          <ReferenceLine y={0} stroke="#64748b" strokeDasharray="3 3" />

          {/* Positive components stack up from zero */}
          <Bar
            dataKey="equity"
            stackId="positive"
            fill="#3b82f6"
            name="Equity"
          />
          <Bar
            dataKey="positiveCashFlow"
            stackId="positive"
            fill="#10b981"
            name="Positive Cash Flow"
          />
          <Bar
            dataKey="taxSavings"
            stackId="positive"
            fill="#8b5cf6"
            name="Tax Savings"
            radius={[4, 4, 0, 0]}
          />

          {/* Negative cash flow goes down from zero */}
          <Bar
            dataKey="negativeCashFlow"
            stackId="negative"
            fill="#ef4444"
            name="Negative Cash Flow"
            radius={[0, 0, 4, 4]}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
