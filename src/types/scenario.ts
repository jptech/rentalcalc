import type { PropertyInputs, CalculationResults } from './property';

export interface SavedScenario {
  id: string;
  name: string;
  inputs: PropertyInputs;
  createdAt: string;
  updatedAt: string;
}

export interface ScenarioComparison {
  scenarios: Array<{
    scenario: SavedScenario;
    results: CalculationResults;
  }>;
}
