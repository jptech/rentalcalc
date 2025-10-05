import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useState } from 'react';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const themes = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Monitor },
  ];

  const currentTheme = themes.find(t => t.value === theme) || themes[0];
  const Icon = currentTheme.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        onBlur={() => setTimeout(() => setShowMenu(false), 200)}
        className="p-2 rounded-lg hover:bg-blue-500/10 dark:hover:bg-blue-400/10 transition-colors"
        aria-label="Toggle theme"
      >
        <Icon className="w-5 h-5 text-white" />
      </button>

      {showMenu && (
        <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 w-36 z-50 animate-fadeIn">
          {themes.map(({ value, label, icon: ThemeIcon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setShowMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors ${
                theme === value
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <ThemeIcon className="w-4 h-4" />
              <span>{label}</span>
              {theme === value && (
                <span className="ml-auto text-blue-600 dark:text-blue-400">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
