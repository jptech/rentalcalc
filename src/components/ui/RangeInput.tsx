import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { Slider } from './Slider';
import type { RangeValue } from '../../types/property';

interface RangeInputProps {
  label: string;
  value: number;
  range?: RangeValue;
  onChange: (value: number) => void;
  onRangeChange: (range: RangeValue) => void;
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  tooltip?: string;
  helpText?: string;
}

export function RangeInput({
  label,
  value,
  range,
  onChange,
  onRangeChange,
  min = 0,
  max = 100,
  step = 0.1,
  suffix = '%',
  tooltip,
  helpText,
}: RangeInputProps) {
  const [showRange, setShowRange] = useState(range?.enabled || false);

  const toggleRange = () => {
    const newEnabled = !showRange;
    setShowRange(newEnabled);

    if (newEnabled) {
      // Initialize range with current value as base and reasonable defaults
      const delta = value * 0.2; // 20% spread
      onRangeChange({
        enabled: true,
        base: value,
        min: Math.max(min, value - delta),
        max: Math.min(max, value + delta),
      });
    } else {
      // Disable range mode
      onRangeChange({
        enabled: false,
        base: value,
        min: value,
        max: value,
      });
    }
  };

  const updateRangeValue = (field: 'min' | 'max' | 'base', newValue: number) => {
    if (!range) return;

    const updated = { ...range, [field]: newValue };

    // Ensure min <= base <= max
    if (field === 'min') {
      updated.base = Math.max(newValue, Math.min(range.base, range.max));
    } else if (field === 'max') {
      updated.base = Math.min(newValue, Math.max(range.base, range.min));
    } else if (field === 'base') {
      updated.min = Math.min(updated.min, newValue);
      updated.max = Math.max(updated.max, newValue);
    }

    onRangeChange(updated);

    // Update the primary value to match base
    if (field === 'base') {
      onChange(newValue);
    }
  };

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
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
      )}

      {/* Input and Range Button */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            type="number"
            step={step}
            value={value}
            onChange={(e) => {
              const newVal = parseFloat(e.target.value) || 0;
              onChange(newVal);
              if (range?.enabled) {
                updateRangeValue('base', newVal);
              }
            }}
            className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        <button
          onClick={toggleRange}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 whitespace-nowrap ${
            showRange
              ? 'bg-blue-100 text-blue-700 border border-blue-300'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
          }`}
          title={showRange ? 'Disable range' : 'Enable range for sensitivity analysis'}
        >
          {showRange ? (
            <>
              <ChevronUp className="w-3 h-3 inline mr-1" />
              Range
            </>
          ) : (
            <>
              <ChevronDown className="w-3 h-3 inline mr-1" />
              Range
            </>
          )}
        </button>
      </div>

      {/* Help Text */}
      {helpText && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}

      {showRange && range?.enabled && (
        <div className="pl-4 border-l-2 border-blue-200 space-y-3 pt-2">
          <div className="text-xs font-semibold text-blue-700 mb-2">
            Sensitivity Range: {range.min.toFixed(1)}{suffix} - {range.max.toFixed(1)}{suffix}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-600 block mb-1">Min</label>
              <input
                type="number"
                step={step}
                value={range.min}
                onChange={(e) => updateRangeValue('min', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Base</label>
              <input
                type="number"
                step={step}
                value={range.base}
                onChange={(e) => updateRangeValue('base', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-blue-300 bg-blue-50 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 block mb-1">Max</label>
              <input
                type="number"
                step={step}
                value={range.max}
                onChange={(e) => updateRangeValue('max', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Slider
              value={range.min}
              min={min}
              max={range.max}
              step={step}
              onChange={(val) => updateRangeValue('min', val)}
              showValue={false}
              className="opacity-60"
            />
            <Slider
              value={range.base}
              min={range.min}
              max={range.max}
              step={step}
              onChange={(val) => updateRangeValue('base', val)}
              showValue={false}
            />
            <Slider
              value={range.max}
              min={range.base}
              max={max}
              step={step}
              onChange={(val) => updateRangeValue('max', val)}
              showValue={false}
              className="opacity-60"
            />
          </div>

          <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
            <strong>Sensitivity analysis:</strong> Calculates best/base/worst case scenarios using this range
          </div>
        </div>
      )}
    </div>
  );
}
