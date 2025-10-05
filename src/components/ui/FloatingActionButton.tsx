import { useState } from 'react';
import { Plus } from 'lucide-react';

export interface QuickAction {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary' | 'success';
}

interface FloatingActionButtonProps {
  actions: QuickAction[];
}

export function FloatingActionButton({ actions }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const variantStyles = {
    default: 'bg-slate-600 hover:bg-slate-700',
    primary: 'bg-blue-600 hover:bg-blue-700',
    success: 'bg-emerald-600 hover:bg-emerald-700',
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Action buttons */}
      <div
        className={`absolute bottom-16 right-0 space-y-3 transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {actions.map((action, index) => {
          const Icon = action.icon;
          const delay = index * 50;

          return (
            <div
              key={action.label}
              className="flex items-center justify-end gap-3 transition-all"
              style={{
                transitionDelay: isOpen ? `${delay}ms` : '0ms',
              }}
            >
              <span className="bg-slate-900 text-white text-sm px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                {action.label}
              </span>
              <button
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`w-12 h-12 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center text-white ${
                  variantStyles[action.variant || 'default']
                }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Main FAB button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-xl transition-all hover:shadow-2xl hover:scale-110 flex items-center justify-center text-white ${
          isOpen ? 'rotate-45' : 'rotate-0'
        }`}
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
