import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

interface TabsProps {
  defaultValue: string;
  children: ReactNode;
  className?: string;
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export function TabsList({ children, className = '' }: TabsListProps) {
  return (
    <div className={`flex space-x-1 border-b border-slate-200 dark:border-slate-700 ${className}`}>
      {children}
    </div>
  );
}

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsTrigger({ value, children, className = '' }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;

  return (
    <button
      className={`
        px-4 py-2.5 font-medium text-sm transition-all relative group
        ${isActive
          ? 'text-white dark:text-white'
          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
        }
        ${className}
      `}
      onClick={() => setActiveTab(value)}
    >
      {/* Background gradient for active tab */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-t-lg shadow-sm transition-colors duration-200" />
      )}

      {/* Hover effect for inactive tabs */}
      {!isActive && (
        <div className="absolute inset-0 bg-slate-100 dark:bg-slate-700 opacity-0 group-hover:opacity-100 rounded-t-lg transition-opacity duration-200" />
      )}

      <span className="relative z-10">{children}</span>
    </button>
  );
}

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabsContent({ value, children, className = '' }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');

  const { activeTab } = context;
  const isActive = activeTab === value;

  return (
    <div
      className={`${
        isActive ? 'block animate-slideUp' : 'hidden'
      } ${className}`}
      role="tabpanel"
    >
      {children}
    </div>
  );
}
