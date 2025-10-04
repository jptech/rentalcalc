import { Home, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onReset: () => void;
}

export function Header({ onReset }: HeaderProps) {
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

          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-white hover:bg-blue-500"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>
    </header>
  );
}
