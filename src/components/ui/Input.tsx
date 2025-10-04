import { InputHTMLAttributes, ReactNode } from 'react';
import { Info } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
  tooltip?: string;
  helpText?: string;
}

export function Input({
  label,
  prefix,
  suffix,
  error,
  tooltip,
  helpText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="space-y-1.5">
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

      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {prefix}
          </span>
        )}

        <input
          className={`
            w-full px-3 py-2 border rounded-lg transition-all
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
            ${prefix ? 'pl-7' : ''}
            ${suffix ? 'pr-10' : ''}
            ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'}
            ${className}
          `}
          {...props}
        />

        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
            {suffix}
          </span>
        )}
      </div>

      {error && (
        <p className="text-xs text-rose-600">{error}</p>
      )}

      {helpText && !error && (
        <p className="text-xs text-slate-500">{helpText}</p>
      )}
    </div>
  );
}

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  tooltip?: string;
  children: ReactNode;
}

export function Select({
  label,
  error,
  tooltip,
  children,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="space-y-1.5">
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

      <select
        className={`
          w-full px-3 py-2 border rounded-lg transition-all
          focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed
          ${error ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500' : 'border-slate-300'}
          ${className}
        `}
        {...props}
      >
        {children}
      </select>

      {error && (
        <p className="text-xs text-rose-600">{error}</p>
      )}
    </div>
  );
}
