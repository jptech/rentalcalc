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

    // Ensure min <= base <= max constraints
    if (field === 'min') {
      // If min is moved above base, adjust base
      if (newValue > range.base) {
        updated.base = newValue;
      }
      // Ensure max is at least as large as new min
      if (newValue > range.max) {
        updated.max = newValue;
        updated.base = newValue;
      }
    } else if (field === 'max') {
      // If max is moved below base, adjust base
      if (newValue < range.base) {
        updated.base = newValue;
      }
      // Ensure min is at most as small as new max
      if (newValue < range.min) {
        updated.min = newValue;
        updated.base = newValue;
      }
    } else if (field === 'base') {
      // When base changes, expand bounds if needed FIRST
      if (newValue < range.min) {
        updated.min = newValue;
      }
      if (newValue > range.max) {
        updated.max = newValue;
      }
      // Then set the base value directly (no clamping needed since we expanded bounds)
      updated.base = newValue;
    }

    onRangeChange(updated);
    // Parent component now handles syncing range.base to the main value
  };

  return (
    <div className="space-y-1.5">
      {/* Label */}
      {label && (
        <div className="flex items-center gap-2">
          <label className="block text-xs uppercase tracking-wide text-slate-600 dark:text-slate-400 font-medium">
            {label}
          </label>
          {tooltip && (
            <div className="group relative">
              <Info className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 cursor-help" />
              <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-slate-900 dark:bg-slate-700 text-white text-xs rounded shadow-lg z-10">
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
              // Parent component now handles syncing value to range.base
            }}
            className="w-full px-3 py-2 pr-10 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg transition-all focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
          />
          {suffix && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 pointer-events-none">
              {suffix}
            </span>
          )}
        </div>

        <button
          onClick={toggleRange}
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex-shrink-0 whitespace-nowrap ${
            showRange
              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
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
        <p className="text-xs text-slate-500 dark:text-slate-400">{helpText}</p>
      )}

      {showRange && range?.enabled && (
        <div className="pl-4 border-l-2 border-blue-200 dark:border-blue-800 space-y-3 pt-2">
          <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
            Sensitivity Range: {range.min.toFixed(1)}{suffix} - {range.max.toFixed(1)}{suffix}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Min</label>
              <input
                type="number"
                step={step}
                value={range.min}
                onChange={(e) => updateRangeValue('min', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Base</label>
              <input
                type="number"
                step={step}
                value={range.base}
                onChange={(e) => updateRangeValue('base', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/30 text-slate-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 font-medium"
              />
            </div>
            <div>
              <label className="text-xs text-slate-600 dark:text-slate-400 block mb-1">Max</label>
              <input
                type="number"
                step={step}
                value={range.max}
                onChange={(e) => updateRangeValue('max', parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Slider
              value={range.min}
              min={min}
              max={max}
              step={step}
              onChange={(val) => updateRangeValue('min', val)}
              showValue={false}
              className="opacity-60"
            />
            <Slider
              value={range.base}
              min={min}
              max={max}
              step={step}
              onChange={(val) => updateRangeValue('base', val)}
              showValue={false}
            />
            <Slider
              value={range.max}
              min={min}
              max={max}
              step={step}
              onChange={(val) => updateRangeValue('max', val)}
              showValue={false}
              className="opacity-60"
            />
          </div>

          <div className="text-xs text-slate-500 dark:text-slate-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded border border-blue-100 dark:border-blue-800">
            <strong>Sensitivity analysis:</strong> Calculates best/base/worst case scenarios using this range
          </div>
        </div>
      )}
    </div>
  );
}
