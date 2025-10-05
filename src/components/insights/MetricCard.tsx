import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  variant?: 'default' | 'success' | 'danger' | 'warning';
  children?: ReactNode;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  children,
}: MetricCardProps) {
  const variantStyles = {
    default: 'from-blue-500 to-blue-600',
    success: 'from-emerald-500 to-emerald-600',
    danger: 'from-rose-500 to-rose-600',
    warning: 'from-amber-500 to-amber-600',
  };

  const textColors = {
    default: 'text-blue-600',
    success: 'text-emerald-600',
    danger: 'text-rose-600',
    warning: 'text-amber-600',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 group">
      <div className={`h-1 bg-gradient-to-r ${variantStyles[variant]} group-hover:h-1.5 transition-all`} />
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs uppercase tracking-wide text-slate-500 font-medium mb-1">
              {title}
            </p>
            <p className={`text-3xl font-bold tabular-nums ${textColors[variant]}`}>
              {value}
            </p>
          </div>
          {Icon && (
            <div className={`p-3 rounded-lg bg-gradient-to-br ${variantStyles[variant]}`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
          )}
        </div>

        {subtitle && (
          <p className="text-sm text-slate-600 mb-2">{subtitle}</p>
        )}

        {trend && (
          <div className="flex items-center text-sm">
            <span className={trend.value >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
              {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value).toFixed(1)}%
            </span>
            <span className="text-slate-500 ml-2">{trend.label}</span>
          </div>
        )}

        {children && <div className="mt-3 pt-3 border-t border-slate-100">{children}</div>}
      </CardContent>
    </Card>
  );
}
