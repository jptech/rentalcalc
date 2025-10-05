import { Home, RotateCcw, Keyboard } from 'lucide-react';
import { Button } from '../ui/Button';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useState } from 'react';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Home className="w-8 h-8" />
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">Rental Property Calculator</h1>
              <p className="text-xs sm:text-sm text-blue-100 hidden sm:block">
                Analyze cash flow, equity, and investment returns
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <div className="relative hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShortcuts(!showShortcuts)}
                onBlur={() => setTimeout(() => setShowShortcuts(false), 200)}
                className="text-white hover:bg-blue-500"
              >
                <Keyboard className="w-4 h-4" />
              </Button>

              {showShortcuts && (
                <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 p-4 w-64 z-50 animate-fadeIn">
                  <h3 className="font-semibold mb-3 text-sm">Keyboard Shortcuts</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Save</span>
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">Ctrl+S</kbd>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600 dark:text-slate-400">Reset</span>
                      <kbd className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded border border-slate-300 dark:border-slate-600 font-mono">Ctrl+R</kbd>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="text-white hover:bg-blue-500"
            >
              <RotateCcw className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
