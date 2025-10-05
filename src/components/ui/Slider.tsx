import { Info } from 'lucide-react';

interface SliderProps {
  label?: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  tooltip?: string;
  showValue?: boolean;
  onChange: (value: number) => void;
  className?: string;
}

export function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  suffix = '%',
  tooltip,
  showValue = true,
  onChange,
  className = '',
}: SliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="block text-xs uppercase tracking-wide text-slate-600 font-medium">
              {label}
            </label>
            {tooltip && (
              <div className="group relative">
                <Info className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 text-white text-xs rounded shadow-lg z-10">
                  {tooltip}
                </div>
              </div>
            )}
          </div>
          {showValue && (
            <span className="text-sm font-medium text-blue-600 tabular-nums">
              {value.toFixed(1)}{suffix}
            </span>
          )}
        </div>
      )}

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={`
            w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-blue-600
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-webkit-slider-thumb]:transition-all
            [&::-webkit-slider-thumb]:hover:bg-blue-700
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-moz-range-thumb]:w-4
            [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-blue-600
            [&::-moz-range-thumb]:border-0
            [&::-moz-range-thumb]:cursor-pointer
            [&::-moz-range-thumb]:transition-all
            [&::-moz-range-thumb]:hover:bg-blue-700
            ${className}
          `}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`,
          }}
        />

        {/* Range labels */}
        <div className="flex justify-between mt-1">
          <span className="text-xs text-slate-400">{min}{suffix}</span>
          <span className="text-xs text-slate-400">{max}{suffix}</span>
        </div>
      </div>
    </div>
  );
}
