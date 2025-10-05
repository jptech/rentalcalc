import { Calculator } from 'lucide-react';
import { useState, type ReactNode } from 'react';

interface CalculationTooltipProps {
  value: number;
  calculation: {
    formula: string;
    breakdown: Array<{ label: string; value: number }>;
  };
  format?: (v: number) => string;
  children?: ReactNode;
}

export function CalculationTooltip({ value, calculation, format = String, children }: CalculationTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  const displayContent = children || (
    <>
      <span className="font-mono">{format(value)}</span>
      <Calculator className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
    </>
  );

  return (
    <span className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="inline-flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
      >
        {displayContent}
      </button>

      {showTooltip && (
        <div className="absolute left-0 bottom-full mb-2 w-72 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 animate-fadeIn">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm">How it's calculated</h4>
              <code className="text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded font-mono block text-slate-800 dark:text-slate-200">
                {calculation.formula}
              </code>
            </div>

            <div className="space-y-1">
              {calculation.breakdown.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                  <span className="font-mono text-slate-900 dark:text-slate-100">{format(item.value)}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 dark:border-slate-700 mt-2 pt-2 flex justify-between text-sm font-semibold">
                <span className="text-slate-900 dark:text-slate-100">Result</span>
                <span className="font-mono text-slate-900 dark:text-slate-100">{format(value)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </span>
  );
}
