import type { PropertyInputs, SensitivityAnalysis, ScenarioResult } from '../../types/property';
import { calculateMortgage } from './mortgage';
import { calculateYearlyProjections, calculateReturnMetrics } from './cashflow';

/**
 * Determines if any sensitivity ranges are enabled
 */
export function hasSensitivityRanges(inputs: PropertyInputs): boolean {
  return !!(
    inputs.appreciationRange?.enabled ||
    inputs.rentGrowthRange?.enabled ||
    inputs.expenseGrowthRange?.enabled ||
    inputs.alternativeReturnRange?.enabled ||
    inputs.interestRateRange?.enabled ||
    inputs.monthlyRentRange?.enabled ||
    inputs.netMonthlyIncomeRange?.enabled ||
    inputs.utilitiesRange?.enabled
  );
}

/**
 * Calculate sensitivity analysis with best/base/worst scenarios
 */
export function calculateSensitivity(inputs: PropertyInputs): SensitivityAnalysis | undefined {
  if (!hasSensitivityRanges(inputs)) {
    return undefined;
  }

  // Create three scenario variants
  const bestInputs = createScenarioInputs(inputs, 'best');
  const baseInputs = createScenarioInputs(inputs, 'base');
  const worstInputs = createScenarioInputs(inputs, 'worst');

  // Calculate each scenario
  const best = calculateScenario('Best Case', bestInputs);
  const base = calculateScenario('Base Case', baseInputs);
  const worst = calculateScenario('Worst Case', worstInputs);

  return {
    enabled: true,
    scenarios: { best, base, worst },
  };
}

/**
 * Create modified inputs for a specific scenario (best/base/worst)
 */
function createScenarioInputs(
  inputs: PropertyInputs,
  scenario: 'best' | 'base' | 'worst'
): PropertyInputs {
  const modified = { ...inputs };

  // Apply appreciation range
  if (inputs.appreciationRange?.enabled) {
    modified.appreciationRate =
      scenario === 'best'
        ? inputs.appreciationRange.max
        : scenario === 'worst'
        ? inputs.appreciationRange.min
        : inputs.appreciationRange.base;
  }

  // Apply rent growth range
  if (inputs.rentGrowthRange?.enabled) {
    modified.rentGrowthRate =
      scenario === 'best'
        ? inputs.rentGrowthRange.max
        : scenario === 'worst'
        ? inputs.rentGrowthRange.min
        : inputs.rentGrowthRange.base;
  }

  // Apply expense growth range (note: lower is better for property investment)
  if (inputs.expenseGrowthRange?.enabled) {
    modified.expenseGrowthRate =
      scenario === 'best'
        ? inputs.expenseGrowthRange.min // Lower expenses = better
        : scenario === 'worst'
        ? inputs.expenseGrowthRange.max // Higher expenses = worse
        : inputs.expenseGrowthRange.base;
  }

  // Apply alternative return range (note: lower is better for property investment)
  if (inputs.alternativeReturnRange?.enabled) {
    modified.alternativeReturn =
      scenario === 'best'
        ? inputs.alternativeReturnRange.min // Lower alternative = property looks better
        : scenario === 'worst'
        ? inputs.alternativeReturnRange.max // Higher alternative = property looks worse
        : inputs.alternativeReturnRange.base;
  }

  // Apply interest rate range (note: lower is better)
  if (inputs.interestRateRange?.enabled && inputs.mode === 'new') {
    modified.interestRate =
      scenario === 'best'
        ? inputs.interestRateRange.min
        : scenario === 'worst'
        ? inputs.interestRateRange.max
        : inputs.interestRateRange.base;
  }

  // Apply monthly rent range (for detailed mode)
  if (inputs.monthlyRentRange?.enabled && inputs.incomeMode === 'detailed') {
    modified.monthlyRent =
      scenario === 'best'
        ? inputs.monthlyRentRange.max // Higher rent = better
        : scenario === 'worst'
        ? inputs.monthlyRentRange.min // Lower rent = worse
        : inputs.monthlyRentRange.base;
  }

  // Apply net monthly income range (for net income mode)
  if (inputs.netMonthlyIncomeRange?.enabled && inputs.incomeMode === 'net') {
    modified.netMonthlyIncome =
      scenario === 'best'
        ? inputs.netMonthlyIncomeRange.max // Higher income = better
        : scenario === 'worst'
        ? inputs.netMonthlyIncomeRange.min // Lower income = worse
        : inputs.netMonthlyIncomeRange.base;
  }

  // Apply utilities range (note: lower is better as it's an expense)
  if (inputs.utilitiesRange?.enabled) {
    modified.utilities =
      scenario === 'best'
        ? inputs.utilitiesRange.min // Lower utilities = better
        : scenario === 'worst'
        ? inputs.utilitiesRange.max // Higher utilities = worse
        : inputs.utilitiesRange.base;
  }

  return modified;
}

/**
 * Calculate a single scenario
 */
function calculateScenario(label: string, inputs: PropertyInputs): ScenarioResult {
  const loanAmount =
    inputs.mode === 'new'
      ? inputs.propertyValue - inputs.downPayment
      : inputs.currentLoanBalance;

  const loanTerm = inputs.mode === 'new' ? inputs.loanTerm : inputs.remainingTerm;

  const mortgage = calculateMortgage(loanAmount, inputs.interestRate, loanTerm);
  const yearlyData = calculateYearlyProjections(inputs, mortgage);
  const returnMetrics = calculateReturnMetrics(inputs, yearlyData);

  const lastYear = yearlyData[yearlyData.length - 1];
  const finalWealth = lastYear?.totalWealth || 0;
  const totalCashFlow = lastYear?.cumulativeCashFlow || 0;

  return {
    label,
    yearlyData,
    returnMetrics,
    finalWealth,
    totalCashFlow,
  };
}
