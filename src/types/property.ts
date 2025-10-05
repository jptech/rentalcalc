// Property ownership modes
export type PropertyMode = 'new' | 'existing';

// Income tracking modes
export type IncomeMode = 'detailed' | 'net';

// Property types with different default characteristics
export type PropertyType = 'SFH' | 'Duplex' | 'Triplex' | 'Fourplex';

// Main property input interface
export interface PropertyInputs {
  // Property Details
  propertyValue: number;
  propertyType: PropertyType;

  // Financing
  mode: PropertyMode;
  downPayment: number; // For new purchase (dollar amount)
  downPaymentPercent: number; // For new purchase (percentage)
  interestRate: number; // Annual percentage
  loanTerm: number; // Years
  closingCosts: number; // Dollar amount

  // Existing property specific
  currentLoanBalance: number;
  monthlyPayment: number;
  remainingTerm: number; // Years
  isPITI: boolean; // Does payment include property tax and insurance?

  // Income
  incomeMode: IncomeMode;
  monthlyRent: number;
  vacancyRate: number; // Percentage
  otherIncome: number; // Monthly
  netMonthlyIncome: number; // For net income mode

  // Operating Expenses (for detailed mode)
  propertyTax: number; // Annual
  insurance: number; // Annual
  hoaFees: number; // Monthly
  utilities: number; // Monthly
  maintenancePercent: number; // Percentage of rent
  managementPercent: number; // Percentage of rent
  capexPercent: number; // Percentage of rent (capital expenditure reserve)

  // Growth Projections
  analysisPeriod: number; // Years
  appreciationRate: number; // Annual percentage
  rentGrowthRate: number; // Annual percentage
  expenseGrowthRate: number; // Annual percentage

  // Tax & Opportunity
  taxBracket: number; // Percentage
  depreciationPeriod: number; // Years (default 27.5)
  buildingValuePercent: number; // Percentage (default 80%)
  alternativeReturn: number; // Annual percentage for opportunity cost
  sellingCosts: number; // Percentage of sale price
}

// Mortgage calculation result
export interface MortgageResult {
  monthlyPayment: number;
  totalInterest: number;
  totalPrincipal: number;
  amortizationSchedule: AmortizationEntry[];
}

// Single entry in amortization schedule
export interface AmortizationEntry {
  year: number;
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

// Yearly projection data
export interface YearlyData {
  year: number;

  // Property value and loan
  propertyValue: number;
  loanBalance: number;
  equity: number;

  // Income
  grossRent: number;
  vacancy: number;
  otherIncome: number;
  effectiveIncome: number;

  // Expenses
  propertyTax: number;
  insurance: number;
  hoaFees: number;
  utilities: number;
  maintenance: number;
  management: number;
  capex: number;
  totalExpenses: number;

  // Mortgage
  mortgagePayment: number;
  principalPaid: number;
  interestPaid: number;

  // Cash flow
  noi: number; // Net Operating Income
  cashFlow: number; // After debt service
  cumulativeCashFlow: number;

  // Tax calculations
  depreciationDeduction: number;
  deductibleExpenses: number;
  taxableIncome: number;
  taxSavings: number;
  cumulativeTaxSavings: number;

  // Wealth accumulation
  equityBuildup: number; // Principal paid down
  appreciationGain: number;
  totalWealth: number; // Equity + cumulative cash flow + tax savings
}

// Return metrics
export interface ReturnMetrics {
  cashOnCashReturn: number; // Percentage
  capRate: number; // Percentage
  totalReturn: number; // Annualized percentage
  roi: number; // Return on investment
}

// Opportunity cost comparison
export interface OpportunityCostAnalysis {
  holdScenario: WealthProjection;
  sellScenario: WealthProjection;
  recommendation: 'hold' | 'sell';
  wealthDifference: number;
  breakEvenYear: number | null;
}

// Wealth projection for hold vs sell
export interface WealthProjection {
  yearlyWealth: number[];
  finalWealth: number;
  totalCashFlow: number;
  capitalGains: number;
  taxOnGains: number;
}

// Complete calculation results
export interface CalculationResults {
  mortgage: MortgageResult;
  yearlyData: YearlyData[];
  returnMetrics: ReturnMetrics;
  opportunityCost: OpportunityCostAnalysis;
  totalInvestment: number; // Down payment + closing costs
  inputs: PropertyInputs; // Include user inputs for reference in components
}

// Default values for different property types
export const PROPERTY_DEFAULTS: Record<PropertyType, { maintenance: number; capex: number; vacancy: number }> = {
  SFH: { maintenance: 1.5, capex: 1.0, vacancy: 5 },
  Duplex: { maintenance: 2.0, capex: 1.5, vacancy: 7 },
  Triplex: { maintenance: 2.5, capex: 2.0, vacancy: 8 },
  Fourplex: { maintenance: 3.0, capex: 2.5, vacancy: 8 },
};

// Default input values
export const DEFAULT_INPUTS: PropertyInputs = {
  // Property Details
  propertyValue: 400000,
  propertyType: 'SFH',

  // Financing
  mode: 'new',
  downPayment: 80000,
  downPaymentPercent: 20,
  interestRate: 7.0,
  loanTerm: 30,
  closingCosts: 12000,

  // Existing property
  currentLoanBalance: 320000,
  monthlyPayment: 2400,
  remainingTerm: 28,
  isPITI: false,

  // Income
  incomeMode: 'detailed',
  monthlyRent: 3200,
  vacancyRate: 5,
  otherIncome: 0,
  netMonthlyIncome: 2800,

  // Operating Expenses
  propertyTax: 4800,
  insurance: 1200,
  hoaFees: 0,
  utilities: 0,
  maintenancePercent: 1.5,
  managementPercent: 8,
  capexPercent: 1.0,

  // Growth Projections
  analysisPeriod: 10,
  appreciationRate: 3,
  rentGrowthRate: 2,
  expenseGrowthRate: 2,

  // Tax & Opportunity
  taxBracket: 24,
  depreciationPeriod: 27.5,
  buildingValuePercent: 80,
  alternativeReturn: 7,
  sellingCosts: 6,
};
