import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Save, BarChart3, Folder, Download } from 'lucide-react';
import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/inputs/InputPanel';
import { ResultsPanel } from './components/layout/ResultsPanel';
import { ToastContainer } from './components/ui/Toast';
import { FloatingActionButton } from './components/ui/FloatingActionButton';
import type { QuickAction } from './components/ui/FloatingActionButton';
import { ScenarioComparison } from './components/scenarios/ScenarioComparison';
import { useCalculations } from './hooks/useCalculations';
import { useToast } from './hooks/useToast';
import { useScenarios } from './hooks/useScenarios';
import type { PropertyInputs } from './types/property';
import { DEFAULT_INPUTS } from './types/property';
import { exportToCSV } from './lib/chartExport';
import { calculateMortgage } from './lib/calculations/mortgage';
import { calculateYearlyProjections, calculateReturnMetrics } from './lib/calculations/cashflow';
import { calculateOpportunityCost } from './lib/calculations/opportunity';

const STORAGE_KEY = 'rental-calc-inputs';

function App() {
  const { toasts, removeToast, showSuccess, showInfo } = useToast();
  const { scenarios, saveScenario } = useScenarios();
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([]);

  // Initialize state from localStorage or defaults
  const [inputs, setInputs] = useState<PropertyInputs>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_INPUTS, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error('Error loading saved inputs:', error);
    }
    return DEFAULT_INPUTS;
  });

  // Auto-save to localStorage (debounced)
  useEffect(() => {
    // Skip showing toast on initial load
    if (!hasInitialized) {
      setHasInitialized(true);
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
        showSuccess('Saved');
      } catch (error) {
        console.error('Error saving inputs:', error);
      }
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [inputs, hasInitialized, showSuccess]);

  // Calculate results
  const results = useCalculations(inputs);

  // Reset to defaults
  const handleReset = useCallback(() => {
    if (confirm('Reset all inputs to default values?')) {
      setInputs(DEFAULT_INPUTS);
      localStorage.removeItem(STORAGE_KEY);
      showInfo('Reset to defaults');
    }
  }, [showInfo]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            // Save (already auto-saves, but show confirmation)
            e.preventDefault();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
            showSuccess('Saved manually');
            break;
          case 'r':
            // Reset
            e.preventDefault();
            handleReset();
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputs, handleReset, showSuccess]);

  // Quick actions for FAB
  const quickActions: QuickAction[] = [
    {
      icon: Save,
      label: 'Save Scenario',
      onClick: () => {
        const name = prompt('Enter scenario name:');
        if (name) {
          saveScenario(name, inputs);
          showSuccess(`Saved scenario: ${name}`);
        }
      },
      variant: 'success',
    },
    {
      icon: Folder,
      label: 'Load Scenario',
      onClick: () => {
        if (scenarios.length === 0) {
          showInfo('No saved scenarios');
          return;
        }
        const scenarioList = scenarios.map((s, i) => `${i + 1}. ${s.name}`).join('\n');
        const choice = prompt(`Select scenario:\n${scenarioList}\n\nEnter number:`);
        if (choice) {
          const index = parseInt(choice) - 1;
          const scenario = scenarios[index];
          if (scenario) {
            setInputs(scenario.inputs);
            showSuccess(`Loaded: ${scenario.name}`);
          }
        }
      },
    },
    {
      icon: BarChart3,
      label: 'Compare Scenarios',
      onClick: () => {
        if (scenarios.length < 2) {
          showInfo('Need at least 2 saved scenarios to compare');
          return;
        }
        // For now, compare all scenarios
        setSelectedScenarios(scenarios.map(s => s.id));
        setShowComparison(true);
      },
      variant: 'primary',
    },
    {
      icon: Download,
      label: 'Export All Data',
      onClick: () => {
        const exportData = results.yearlyData.map(d => ({
          Year: d.year,
          'Property Value': d.propertyValue,
          'Loan Balance': d.loanBalance,
          Equity: d.equity,
          'Cash Flow': d.cashFlow,
          'Cumulative Cash Flow': d.cumulativeCashFlow,
          NOI: d.noi,
        }));
        exportToCSV(exportData, 'rental-property-analysis');
        showSuccess('Data exported');
      },
    },
  ];

  // Prepare comparison data using useMemo to avoid hook violations
  const comparisonScenarios = useMemo(() => {
    return selectedScenarios
      .map(id => {
        const scenario = scenarios.find(s => s.id === id);
        if (!scenario) return null;

        // Calculate results manually without using the hook
        const inputs = scenario.inputs;

        const totalInvestment = inputs.mode === 'new'
          ? inputs.downPayment + inputs.closingCosts
          : inputs.downPayment || inputs.propertyValue - inputs.currentLoanBalance;

        const loanAmount = inputs.mode === 'new'
          ? inputs.propertyValue - inputs.downPayment
          : inputs.currentLoanBalance;

        const loanTerm = inputs.mode === 'new' ? inputs.loanTerm : inputs.remainingTerm;

        const mortgage = calculateMortgage(loanAmount, inputs.interestRate, loanTerm);
        const yearlyData = calculateYearlyProjections(inputs, mortgage);
        const returnMetrics = calculateReturnMetrics(inputs, yearlyData);
        const opportunityCost = calculateOpportunityCost(inputs, yearlyData);

        return {
          scenario,
          results: {
            mortgage,
            yearlyData,
            returnMetrics,
            opportunityCost,
            totalInvestment,
            inputs,
          },
        };
      })
      .filter(Boolean) as Array<{ scenario: any; results: any }>;
  }, [selectedScenarios, scenarios]);

  return (
    <>
      <AppLayout
        onReset={handleReset}
        inputPanel={<InputPanel inputs={inputs} onChange={setInputs} />}
        resultsPanel={<ResultsPanel results={results} />}
      />
      <FloatingActionButton actions={quickActions} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showComparison && (
        <ScenarioComparison
          scenarios={comparisonScenarios}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  );
}

export default App;
