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
    default: 'bg-blue-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
  };

  const bgColors = {
    default: 'bg-blue-100',
    success: 'bg-emerald-100',
    warning: 'bg-amber-100',
    danger: 'bg-rose-100',
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
        <span className="text-slate-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-900 tabular-nums">
            {value.toFixed(1)}{suffix}
          </span>
          <span className="text-xs text-slate-400">
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
