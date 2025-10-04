import type { PropertyInputs, YearlyData, OpportunityCostAnalysis, WealthProjection } from '../../types/property';

/**
 * Calculate opportunity cost analysis: Hold vs Sell
 */
export function calculateOpportunityCost(
  inputs: PropertyInputs,
  yearlyData: YearlyData[]
): OpportunityCostAnalysis {
  const currentEquity = inputs.mode === 'new'
    ? inputs.downPayment
    : inputs.propertyValue - inputs.currentLoanBalance;

  // Sell scenario: Sell now and invest proceeds
  const sellingCostAmount = inputs.propertyValue * (inputs.sellingCosts / 100);
  const netProceeds = currentEquity - sellingCostAmount;

  // Capital gains calculation (simplified - assuming property was purchased at current value)
  const purchasePrice = inputs.propertyValue;
  const capitalGains = 0; // No gain if selling at current value
  const taxOnGains = capitalGains * (inputs.taxBracket / 100);

  const investmentProceeds = netProceeds - taxOnGains;

  const sellYearlyWealth: number[] = [];
  for (let year = 1; year <= inputs.analysisPeriod; year++) {
    const wealth = investmentProceeds * Math.pow(1 + inputs.alternativeReturn / 100, year);
    sellYearlyWealth.push(wealth);
  }

  const sellScenario: WealthProjection = {
    yearlyWealth: sellYearlyWealth,
    finalWealth: sellYearlyWealth[sellYearlyWealth.length - 1],
    totalCashFlow: 0,
    capitalGains,
    taxOnGains,
  };

  // Hold scenario: Keep property and track total wealth
  const holdYearlyWealth: number[] = yearlyData.map(yd => yd.totalWealth);

  // Calculate capital gains if selling at end of analysis period
  const finalPropertyValue = yearlyData[yearlyData.length - 1].propertyValue;
  const finalLoanBalance = yearlyData[yearlyData.length - 1].loanBalance;
  const finalEquity = finalPropertyValue - finalLoanBalance;
  const holdCapitalGains = finalPropertyValue - purchasePrice;
  const holdTaxOnGains = holdCapitalGains * (inputs.taxBracket / 100) * 0.15; // Assuming 15% long-term cap gains
  const holdSellingCost = finalPropertyValue * (inputs.sellingCosts / 100);
  const holdNetProceeds = finalEquity - holdSellingCost - holdTaxOnGains;

  const holdScenario: WealthProjection = {
    yearlyWealth: holdYearlyWealth,
    finalWealth: holdNetProceeds + yearlyData[yearlyData.length - 1].cumulativeCashFlow,
    totalCashFlow: yearlyData[yearlyData.length - 1].cumulativeCashFlow,
    capitalGains: holdCapitalGains,
    taxOnGains: holdTaxOnGains,
  };

  // Determine recommendation
  const wealthDifference = holdScenario.finalWealth - sellScenario.finalWealth;
  const recommendation = wealthDifference > 0 ? 'hold' : 'sell';

  // Find break-even year (if any)
  let breakEvenYear: number | null = null;
  for (let i = 0; i < inputs.analysisPeriod; i++) {
    if (holdYearlyWealth[i] > sellYearlyWealth[i]) {
      breakEvenYear = i + 1;
      break;
    }
  }

  return {
    holdScenario,
    sellScenario,
    recommendation,
    wealthDifference,
    breakEvenYear,
  };
}
