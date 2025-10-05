import { useMemo } from 'react';
import type { PropertyInputs, CalculationResults } from '../types/property';
import { calculateMortgage } from '../lib/calculations/mortgage';
import { calculateYearlyProjections, calculateReturnMetrics } from '../lib/calculations/cashflow';
import { calculateOpportunityCost } from '../lib/calculations/opportunity';
import { calculateSensitivity } from '../lib/calculations/sensitivity';

/**
 * Main calculation hook with memoization
 * Recalculates only when relevant inputs change
 */
export function useCalculations(inputs: PropertyInputs): CalculationResults {
  // Calculate total investment
  const totalInvestment = useMemo(() => {
    if (inputs.mode === 'new') {
      return inputs.downPayment + inputs.closingCosts;
    } else {
      // For existing property, use down payment as proxy
      return inputs.downPayment || inputs.propertyValue - inputs.currentLoanBalance;
    }
  }, [inputs.mode, inputs.downPayment, inputs.closingCosts, inputs.propertyValue, inputs.currentLoanBalance]);

  // Calculate mortgage details
  const mortgage = useMemo(() => {
    if (inputs.mode === 'new') {
      const loanAmount = inputs.propertyValue - inputs.downPayment;
      return calculateMortgage(loanAmount, inputs.interestRate, inputs.loanTerm);
    } else {
      // Existing property
      return calculateMortgage(inputs.currentLoanBalance, inputs.interestRate, inputs.remainingTerm);
    }
  }, [
    inputs.mode,
    inputs.propertyValue,
    inputs.downPayment,
    inputs.currentLoanBalance,
    inputs.interestRate,
    inputs.loanTerm,
    inputs.remainingTerm,
  ]);

  // Calculate yearly projections
  const yearlyData = useMemo(() => {
    return calculateYearlyProjections(inputs, mortgage);
  }, [inputs, mortgage]);

  // Calculate return metrics
  const returnMetrics = useMemo(() => {
    return calculateReturnMetrics(inputs, yearlyData);
  }, [inputs, yearlyData]);

  // Calculate opportunity cost
  const opportunityCost = useMemo(() => {
    return calculateOpportunityCost(inputs, yearlyData);
  }, [inputs, yearlyData]);

  // Calculate sensitivity analysis if ranges are enabled
  const sensitivity = useMemo(() => {
    return calculateSensitivity(inputs);
  }, [
    inputs.appreciationRange,
    inputs.rentGrowthRange,
    inputs.expenseGrowthRange,
    inputs.alternativeReturnRange,
    inputs.interestRateRange,
    inputs.monthlyRentRange,
    inputs.netMonthlyIncomeRange,
    inputs.utilitiesRange,
    // Include other inputs that affect calculations
    inputs.propertyValue,
    inputs.downPayment,
    inputs.monthlyRent,
    inputs.netMonthlyIncome,
    inputs.utilities,
    inputs.analysisPeriod,
    inputs.incomeMode,
    inputs.mode,
  ]);

  return {
    mortgage,
    yearlyData,
    returnMetrics,
    opportunityCost,
    totalInvestment,
    inputs, // Pass inputs through for reference in components
    sensitivity,
  };
}
