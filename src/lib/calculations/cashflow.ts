import type { PropertyInputs, YearlyData, MortgageResult, ReturnMetrics } from '../../types/property';
import { calculateYearlyPrincipalInterest } from './mortgage';

/**
 * Calculate yearly projections for the property
 */
export function calculateYearlyProjections(
  inputs: PropertyInputs,
  mortgage: MortgageResult
): YearlyData[] {
  const yearlyData: YearlyData[] = [];
  let cumulativeCashFlow = 0;
  let cumulativeTaxSavings = 0;

  for (let year = 1; year <= inputs.analysisPeriod; year++) {
    const growthFactor = year - 1;

    // Property value with appreciation
    const propertyValue = inputs.propertyValue * Math.pow(1 + inputs.appreciationRate / 100, year);

    // Loan balance
    const yearEntries = mortgage.amortizationSchedule.filter(entry => entry.year === year);
    const loanBalance = yearEntries.length > 0 ? yearEntries[yearEntries.length - 1].balance : 0;
    const equity = propertyValue - loanBalance;

    // Calculate mortgage payments for the year
    const { principal: principalPaid, interest: interestPaid } = calculateYearlyPrincipalInterest(
      mortgage.amortizationSchedule,
      year
    );

    // Determine mortgage term for this scenario
    const mortgageTerm = inputs.mode === 'new' ? inputs.loanTerm : inputs.remainingTerm;
    const isMortgagePaidOff = year > mortgageTerm;

    // For existing properties with user-specified payment, use that instead of calculated
    // This is important when isPITI is true and payment includes taxes/insurance
    // BUT: after mortgage is paid off, payment should be 0
    let mortgagePayment = 0;
    if (!isMortgagePaidOff) {
      mortgagePayment = inputs.mode === 'existing' && inputs.monthlyPayment > 0
        ? inputs.monthlyPayment * 12
        : principalPaid + interestPaid;
    }

    // Income calculations
    let grossRent: number;
    let vacancy: number;
    let otherIncome: number;
    let effectiveIncome: number;

    if (inputs.incomeMode === 'detailed') {
      grossRent = inputs.monthlyRent * 12 * Math.pow(1 + inputs.rentGrowthRate / 100, growthFactor);
      vacancy = grossRent * (inputs.vacancyRate / 100);
      otherIncome = inputs.otherIncome * 12 * Math.pow(1 + inputs.rentGrowthRate / 100, growthFactor);
      effectiveIncome = grossRent - vacancy + otherIncome;
    } else {
      // Net income mode
      grossRent = 0;
      vacancy = 0;
      otherIncome = 0;
      effectiveIncome = inputs.netMonthlyIncome * 12 * Math.pow(1 + inputs.rentGrowthRate / 100, growthFactor);
    }

    // Operating expenses
    let propertyTax: number;
    let insurance: number;
    let hoaFees: number;
    let utilities: number;
    let maintenance: number;
    let management: number;
    let capex: number;

    // Calculate growing tax and insurance (even if PITI, for accurate tracking)
    const growingPropertyTax = inputs.propertyTax * Math.pow(1 + inputs.expenseGrowthRate / 100, growthFactor);
    const growingInsurance = inputs.insurance * Math.pow(1 + inputs.expenseGrowthRate / 100, growthFactor);

    if (inputs.incomeMode === 'detailed') {
      // Always track the actual values for tax and insurance
      propertyTax = growingPropertyTax;
      insurance = growingInsurance;
      hoaFees = inputs.hoaFees * 12 * Math.pow(1 + inputs.expenseGrowthRate / 100, growthFactor);
      utilities = inputs.utilities * 12 * Math.pow(1 + inputs.expenseGrowthRate / 100, growthFactor);

      const currentRent = inputs.monthlyRent * Math.pow(1 + inputs.rentGrowthRate / 100, growthFactor);
      maintenance = currentRent * 12 * (inputs.maintenancePercent / 100);
      management = currentRent * 12 * (inputs.managementPercent / 100);
      capex = currentRent * 12 * (inputs.capexPercent / 100);
    } else {
      // Net income mode - minimal expenses (already accounted for in net income)
      propertyTax = growingPropertyTax;
      insurance = growingInsurance;
      hoaFees = 0;
      utilities = inputs.utilities * 12 * Math.pow(1 + inputs.expenseGrowthRate / 100, growthFactor);
      maintenance = 0;
      management = 0;
      capex = 0;
    }

    // If PITI, only non-T&I expenses count toward operating expenses
    // Tax and insurance are paid via the mortgage payment
    const totalExpenses = inputs.isPITI
      ? hoaFees + utilities + maintenance + management + capex
      : propertyTax + insurance + hoaFees + utilities + maintenance + management + capex;

    // Net Operating Income (before debt service)
    const noi = effectiveIncome - totalExpenses;

    // Cash flow (after mortgage payment)
    // If PITI, the growing tax and insurance need to be subtracted separately
    // since they're not included in totalExpenses but are real costs
    let cashFlow = noi - mortgagePayment;
    if (inputs.isPITI && !isMortgagePaidOff) {
      cashFlow -= (growingPropertyTax + growingInsurance);
    }
    cumulativeCashFlow += cashFlow;

    // Tax calculations
    const depreciationDeduction = (inputs.propertyValue * (inputs.buildingValuePercent / 100)) / inputs.depreciationPeriod;
    // For tax purposes, always include property tax and insurance in deductions
    const actualTotalExpenses = propertyTax + insurance + hoaFees + utilities + maintenance + management + capex;
    const deductibleExpenses = actualTotalExpenses + interestPaid + depreciationDeduction;
    const taxableIncome = effectiveIncome - deductibleExpenses;
    const taxSavings = taxableIncome < 0 ? Math.abs(taxableIncome) * (inputs.taxBracket / 100) : 0;
    cumulativeTaxSavings += taxSavings;

    // Wealth accumulation
    const equityBuildup = principalPaid;
    const appreciationGain = inputs.propertyValue * (inputs.appreciationRate / 100) * year;
    const totalWealth = equity + cumulativeCashFlow + cumulativeTaxSavings;

    yearlyData.push({
      year,
      propertyValue,
      loanBalance,
      equity,
      grossRent,
      vacancy,
      otherIncome,
      effectiveIncome,
      propertyTax,
      insurance,
      hoaFees,
      utilities,
      maintenance,
      management,
      capex,
      totalExpenses,
      mortgagePayment,
      principalPaid,
      interestPaid,
      noi,
      cashFlow,
      cumulativeCashFlow,
      depreciationDeduction,
      deductibleExpenses,
      taxableIncome,
      taxSavings,
      cumulativeTaxSavings,
      equityBuildup,
      appreciationGain,
      totalWealth,
    });
  }

  return yearlyData;
}

/**
 * Calculate return metrics
 */
export function calculateReturnMetrics(
  inputs: PropertyInputs,
  yearlyData: YearlyData[]
): ReturnMetrics {
  if (yearlyData.length === 0) {
    return {
      cashOnCashReturn: 0,
      capRate: 0,
      totalReturn: 0,
      roi: 0,
    };
  }

  // Total investment (down payment + closing costs for new, or just track existing)
  const totalInvestment = inputs.mode === 'new'
    ? inputs.downPayment + inputs.closingCosts
    : inputs.downPayment; // For existing, use down payment as proxy for initial investment

  // Cash-on-Cash Return (Year 1 cash flow / total investment)
  const cashOnCashReturn = (yearlyData[0].cashFlow / totalInvestment) * 100;

  // Cap Rate (Year 1 NOI / property value)
  const capRate = (yearlyData[0].noi / inputs.propertyValue) * 100;

  // Total Return (annualized)
  const finalYear = yearlyData[yearlyData.length - 1];
  const totalGain = finalYear.totalWealth - totalInvestment;
  const years = inputs.analysisPeriod;
  const totalReturn = (Math.pow(finalYear.totalWealth / totalInvestment, 1 / years) - 1) * 100;

  // ROI (total gain / investment)
  const roi = (totalGain / totalInvestment) * 100;

  return {
    cashOnCashReturn,
    capRate,
    totalReturn,
    roi,
  };
}
