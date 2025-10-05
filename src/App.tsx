import { useState, useEffect, useCallback, useRef } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/inputs/InputPanel';
import { ResultsPanel } from './components/layout/ResultsPanel';
import { ToastContainer } from './components/ui/Toast';
import { useCalculations } from './hooks/useCalculations';
import { useToast } from './hooks/useToast';
import type { PropertyInputs } from './types/property';
import { DEFAULT_INPUTS } from './types/property';

const STORAGE_KEY = 'rental-calc-inputs';

function App() {
  const { toasts, removeToast, showSuccess, showInfo } = useToast();
  const saveTimeoutRef = useRef<number | undefined>(undefined);
  const [hasInitialized, setHasInitialized] = useState(false);

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

  return (
    <>
      <AppLayout
        onReset={handleReset}
        inputPanel={<InputPanel inputs={inputs} onChange={setInputs} />}
        resultsPanel={<ResultsPanel results={results} />}
      />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;
