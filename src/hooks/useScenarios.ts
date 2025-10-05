import { useState, useEffect, useCallback } from 'react';
import type { SavedScenario } from '../types/scenario';
import type { PropertyInputs } from '../types/property';

const SCENARIOS_KEY = 'rental-calc-scenarios';

export function useScenarios() {
  const [scenarios, setScenarios] = useState<SavedScenario[]>(() => {
    try {
      const saved = localStorage.getItem(SCENARIOS_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading scenarios:', error);
      return [];
    }
  });

  // Save to localStorage whenever scenarios change
  useEffect(() => {
    try {
      localStorage.setItem(SCENARIOS_KEY, JSON.stringify(scenarios));
    } catch (error) {
      console.error('Error saving scenarios:', error);
    }
  }, [scenarios]);

  const saveScenario = useCallback((name: string, inputs: PropertyInputs): SavedScenario => {
    const newScenario: SavedScenario = {
      id: Date.now().toString(),
      name,
      inputs,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setScenarios(prev => [...prev, newScenario]);
    return newScenario;
  }, []);

  const updateScenario = useCallback((id: string, updates: Partial<SavedScenario>) => {
    setScenarios(prev =>
      prev.map(scenario =>
        scenario.id === id
          ? { ...scenario, ...updates, updatedAt: new Date().toISOString() }
          : scenario
      )
    );
  }, []);

  const deleteScenario = useCallback((id: string) => {
    setScenarios(prev => prev.filter(scenario => scenario.id !== id));
  }, []);

  const loadScenario = useCallback((id: string): SavedScenario | undefined => {
    return scenarios.find(scenario => scenario.id === id);
  }, [scenarios]);

  return {
    scenarios,
    saveScenario,
    updateScenario,
    deleteScenario,
    loadScenario,
  };
}
