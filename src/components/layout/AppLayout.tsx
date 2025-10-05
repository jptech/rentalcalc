import type { ReactNode } from 'react';
import { Header } from './Header';

interface AppLayoutProps {
  onReset: () => void;
  inputPanel: ReactNode;
  resultsPanel: ReactNode;
}

export function AppLayout({ onReset, inputPanel, resultsPanel }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <Header onReset={onReset} />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Input Panel - Left side on desktop */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="sticky top-6">
              {inputPanel}
            </div>
          </div>

          {/* Results Panel - Right side on desktop */}
          <div className="lg:col-span-7 xl:col-span-8">
            {resultsPanel}
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 py-4 mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-600 dark:text-slate-400">
            For educational purposes only. Consult with qualified professionals before making investment decisions.
          </p>
        </div>
      </footer>
    </div>
  );
}
