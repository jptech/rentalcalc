import { useState, useEffect } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { InputPanel } from './components/inputs/InputPanel';
import { ResultsPanel } from './components/layout/ResultsPanel';
import { useCalculations } from './hooks/useCalculations';
import type { PropertyInputs } from './types/property';
import { DEFAULT_INPUTS } from './types/property';

const STORAGE_KEY = 'rental-calc-inputs';

function App() {
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
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
      } catch (error) {
        console.error('Error saving inputs:', error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [inputs]);

  // Calculate results
  const results = useCalculations(inputs);

  // Reset to defaults
  const handleReset = () => {
    if (confirm('Reset all inputs to default values?')) {
      setInputs(DEFAULT_INPUTS);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  return (
    <AppLayout
      onReset={handleReset}
      inputPanel={<InputPanel inputs={inputs} onChange={setInputs} />}
      resultsPanel={<ResultsPanel results={results} />}
    />
  );
}

export default App;
