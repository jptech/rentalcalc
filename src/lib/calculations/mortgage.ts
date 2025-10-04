import { AmortizationEntry, MortgageResult } from '../../types/property';

/**
 * Calculate monthly mortgage payment using standard amortization formula
 * M = P[r(1+r)^n]/[(1+r)^n-1]
 */
export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  if (principal <= 0 || years <= 0) return 0;
  if (annualRate === 0) return principal / (years * 12);

  const monthlyRate = annualRate / 100 / 12;
  const numberOfPayments = years * 12;

  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
}

/**
 * Generate full amortization schedule
 */
export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationEntry[] {
  const schedule: AmortizationEntry[] = [];
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const monthlyRate = annualRate / 100 / 12;
  let balance = principal;

  for (let month = 1; month <= years * 12; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    // Handle final payment rounding
    if (month === years * 12) {
      balance = 0;
    }

    schedule.push({
      year: Math.ceil(month / 12),
      month,
      payment: monthlyPayment,
      principal: principalPayment,
      interest: interestPayment,
      balance: Math.max(0, balance),
    });
  }

  return schedule;
}

/**
 * Calculate mortgage details including total interest and principal
 */
export function calculateMortgage(
  principal: number,
  annualRate: number,
  years: number
): MortgageResult {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const amortizationSchedule = generateAmortizationSchedule(principal, annualRate, years);

  const totalInterest = amortizationSchedule.reduce((sum, entry) => sum + entry.interest, 0);
  const totalPrincipal = principal;

  return {
    monthlyPayment,
    totalInterest,
    totalPrincipal,
    amortizationSchedule,
  };
}

/**
 * Calculate remaining balance at a specific year
 */
export function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  totalYears: number,
  yearsPassed: number
): number {
  if (yearsPassed >= totalYears) return 0;
  if (yearsPassed === 0) return principal;

  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = totalYears * 12;
  const paymentsMade = yearsPassed * 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, totalYears);

  // Calculate remaining balance using formula
  const remainingPayments = totalPayments - paymentsMade;
  const balance =
    (monthlyPayment * (Math.pow(1 + monthlyRate, remainingPayments) - 1)) /
    (monthlyRate * Math.pow(1 + monthlyRate, remainingPayments));

  return Math.max(0, balance);
}

/**
 * Calculate principal and interest paid in a specific year
 */
export function calculateYearlyPrincipalInterest(
  amortizationSchedule: AmortizationEntry[],
  year: number
): { principal: number; interest: number } {
  const yearEntries = amortizationSchedule.filter(entry => entry.year === year);

  return {
    principal: yearEntries.reduce((sum, entry) => sum + entry.principal, 0),
    interest: yearEntries.reduce((sum, entry) => sum + entry.interest, 0),
  };
}
