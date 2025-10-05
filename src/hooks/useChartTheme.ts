import { useTheme } from '../contexts/ThemeContext';

export function useChartTheme() {
  const { effectiveTheme } = useTheme();
  const isDark = effectiveTheme === 'dark';

  return {
    // Grid and axes
    grid: {
      stroke: isDark ? '#475569' : '#e2e8f0', // slate-600 : slate-200
    },
    axis: {
      tick: { fill: isDark ? '#94a3b8' : '#64748b', fontSize: 12 }, // slate-400 : slate-500
      tickLine: { stroke: isDark ? '#475569' : '#cbd5e1' }, // slate-600 : slate-300
    },
    // Tooltip
    tooltip: {
      contentStyle: {
        backgroundColor: isDark ? '#1e293b' : '#ffffff', // slate-800 : white
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, // slate-700 : slate-200
        borderRadius: '8px',
        boxShadow: isDark
          ? '0 10px 15px -3px rgb(0 0 0 / 0.3)'
          : '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        color: isDark ? '#f1f5f9' : '#0f172a', // slate-100 : slate-900
      },
      labelStyle: {
        color: isDark ? '#f1f5f9' : '#0f172a',
      },
      itemStyle: {
        color: isDark ? '#e2e8f0' : '#334155',
      },
    },
    // Legend
    legend: {
      wrapperStyle: {
        paddingTop: '20px',
      },
      iconType: 'square' as const,
    },
    // Reference lines
    referenceLine: {
      stroke: isDark ? '#64748b' : '#64748b', // slate-500
      strokeDasharray: '3 3',
    },
    // Label colors
    label: {
      fill: isDark ? '#94a3b8' : '#64748b', // slate-400 : slate-500
      fontSize: 12,
    },
    // Chart-specific colors (these work well in both modes)
    colors: {
      // Primary brand color
      primary: isDark ? '#60a5fa' : '#3b82f6', // blue-400 : blue-600

      // Success/positive
      success: isDark ? '#34d399' : '#10b981', // emerald-400 : emerald-600

      // Danger/negative
      danger: isDark ? '#f87171' : '#ef4444', // red-400 : red-600

      // Warning
      warning: isDark ? '#fbbf24' : '#f59e0b', // amber-400 : amber-500

      // Purple (for tax savings, etc.)
      purple: isDark ? '#a78bfa' : '#8b5cf6', // violet-400 : violet-600

      // Secondary blue
      secondaryBlue: isDark ? '#60a5fa' : '#3b82f6', // blue-400 : blue-600
    },
    // Gradient stops for area charts
    gradients: {
      blue: {
        start: { stopColor: isDark ? '#60a5fa' : '#3b82f6', stopOpacity: 0.8 },
        end: { stopColor: isDark ? '#60a5fa' : '#3b82f6', stopOpacity: 0.2 },
      },
      green: {
        start: { stopColor: isDark ? '#34d399' : '#10b981', stopOpacity: 0.8 },
        end: { stopColor: isDark ? '#34d399' : '#10b981', stopOpacity: 0.2 },
      },
      red: {
        start: { stopColor: isDark ? '#f87171' : '#ef4444', stopOpacity: 0.8 },
        end: { stopColor: isDark ? '#f87171' : '#ef4444', stopOpacity: 0.2 },
      },
    },
  };
}
