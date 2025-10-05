interface GaugeProps {
  value: number;
  target: number;
  label: string;
  suffix?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function Gauge({ value, target, label, suffix = '%', variant = 'default' }: GaugeProps) {
  const percentage = Math.min((value / target) * 100, 100);

  const colors = {
    default: 'bg-blue-500 dark:bg-blue-400',
    success: 'bg-emerald-500 dark:bg-emerald-400',
    warning: 'bg-amber-500 dark:bg-amber-400',
    danger: 'bg-rose-500 dark:bg-rose-400',
  };

  const bgColors = {
    default: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-emerald-100 dark:bg-emerald-900/30',
    warning: 'bg-amber-100 dark:bg-amber-900/30',
    danger: 'bg-rose-100 dark:bg-rose-900/30',
  };

  // Auto-determine variant based on value vs target
  let autoVariant: typeof variant = 'default';
  if (value >= target) autoVariant = 'success';
  else if (value >= target * 0.7) autoVariant = 'warning';
  else autoVariant = 'danger';

  const finalVariant = variant === 'default' ? autoVariant : variant;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600 dark:text-slate-400">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
            {value.toFixed(1)}{suffix}
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            / {target}{suffix}
          </span>
        </div>
      </div>

      <div className={`relative h-2 rounded-full ${bgColors[finalVariant]} overflow-hidden`}>
        <div
          className={`absolute left-0 top-0 h-full ${colors[finalVariant]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
