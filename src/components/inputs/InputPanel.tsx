import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Input, Select } from '../ui/Input';
import type { PropertyInputs, PropertyType } from '../../types/property';
import { PROPERTY_DEFAULTS } from '../../types/property';

interface InputPanelProps {
  inputs: PropertyInputs;
  onChange: (inputs: PropertyInputs) => void;
}

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({ title, children, defaultOpen = true }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 px-4 hover:bg-slate-50 transition-colors"
      >
        <h4 className="text-sm font-semibold text-slate-900">{title}</h4>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-500" />
        )}
      </button>
      {isOpen && <div className="px-4 pb-4 space-y-4">{children}</div>}
    </div>
  );
}

export function InputPanel({ inputs, onChange }: InputPanelProps) {
  const updateInput = (key: keyof PropertyInputs, value: any) => {
    const updated = { ...inputs, [key]: value };

    // Auto-update down payment when percentage changes
    if (key === 'downPaymentPercent') {
      updated.downPayment = inputs.propertyValue * (value / 100);
    }
    // Auto-update percentage when down payment changes
    if (key === 'downPayment') {
      updated.downPaymentPercent = (value / inputs.propertyValue) * 100;
    }
    // Update defaults when property type changes
    if (key === 'propertyType') {
      const defaults = PROPERTY_DEFAULTS[value as PropertyType];
      updated.maintenancePercent = defaults.maintenance;
      updated.capexPercent = defaults.capex;
      updated.vacancyRate = defaults.vacancy;
    }

    onChange(updated);
  };

  return (
    <Card className="max-h-[calc(100vh-8rem)] overflow-y-auto">
      <CardHeader className="bg-gradient-to-r from-slate-50 to-white">
        <CardTitle>Property Inputs</CardTitle>
      </CardHeader>

      <div>
        {/* Property Details */}
        <CollapsibleSection title="🏠 Property Details">
          <Input
            label="Property Value"
            type="number"
            prefix="$"
            value={inputs.propertyValue}
            onChange={(e) => updateInput('propertyValue', parseFloat(e.target.value) || 0)}
            tooltip="Current or purchase price of the property"
          />

          <Select
            label="Property Type"
            value={inputs.propertyType}
            onChange={(e) => updateInput('propertyType', e.target.value as PropertyType)}
            tooltip="Property type affects default expense percentages"
          >
            <option value="SFH">Single Family Home</option>
            <option value="Duplex">Duplex (2 units)</option>
            <option value="Triplex">Triplex (3 units)</option>
            <option value="Fourplex">Fourplex (4 units)</option>
          </Select>
        </CollapsibleSection>

        {/* Financing */}
        <CollapsibleSection title="💰 Financing">
          <div className="flex gap-2">
            <button
              onClick={() => updateInput('mode', 'new')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                inputs.mode === 'new'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              New Purchase
            </button>
            <button
              onClick={() => updateInput('mode', 'existing')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                inputs.mode === 'existing'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Existing Property
            </button>
          </div>

          {inputs.mode === 'new' ? (
            <>
              <Input
                label="Down Payment"
                type="number"
                prefix="$"
                value={inputs.downPayment}
                onChange={(e) => updateInput('downPayment', parseFloat(e.target.value) || 0)}
                tooltip="Initial cash investment"
              />

              <Input
                label="Down Payment %"
                type="number"
                suffix="%"
                value={inputs.downPaymentPercent.toFixed(1)}
                onChange={(e) => updateInput('downPaymentPercent', parseFloat(e.target.value) || 0)}
                helpText={`Loan amount: $${(inputs.propertyValue - inputs.downPayment).toLocaleString()}`}
              />

              <Input
                label="Interest Rate"
                type="number"
                step="0.1"
                suffix="%"
                value={inputs.interestRate}
                onChange={(e) => updateInput('interestRate', parseFloat(e.target.value) || 0)}
                tooltip="Annual interest rate on the mortgage"
              />

              <Input
                label="Loan Term"
                type="number"
                suffix="years"
                value={inputs.loanTerm}
                onChange={(e) => updateInput('loanTerm', parseFloat(e.target.value) || 0)}
                tooltip="Length of the mortgage in years"
              />

              <Input
                label="Closing Costs"
                type="number"
                prefix="$"
                value={inputs.closingCosts}
                onChange={(e) => updateInput('closingCosts', parseFloat(e.target.value) || 0)}
                tooltip="One-time costs to purchase the property"
                helpText="Typically 2-5% of purchase price"
              />
            </>
          ) : (
            <>
              <Input
                label="Current Loan Balance"
                type="number"
                prefix="$"
                value={inputs.currentLoanBalance}
                onChange={(e) => updateInput('currentLoanBalance', parseFloat(e.target.value) || 0)}
                tooltip="Outstanding mortgage balance"
              />

              <Input
                label="Monthly Payment"
                type="number"
                prefix="$"
                value={inputs.monthlyPayment}
                onChange={(e) => updateInput('monthlyPayment', parseFloat(e.target.value) || 0)}
                tooltip="Current monthly mortgage payment"
              />

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPITI"
                  checked={inputs.isPITI}
                  onChange={(e) => updateInput('isPITI', e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPITI" className="text-sm text-slate-700">
                  Payment includes taxes & insurance (PITI)
                </label>
              </div>

              <Input
                label="Interest Rate"
                type="number"
                step="0.1"
                suffix="%"
                value={inputs.interestRate}
                onChange={(e) => updateInput('interestRate', parseFloat(e.target.value) || 0)}
              />

              <Input
                label="Remaining Term"
                type="number"
                suffix="years"
                value={inputs.remainingTerm}
                onChange={(e) => updateInput('remainingTerm', parseFloat(e.target.value) || 0)}
                tooltip="Years left on the mortgage"
              />
            </>
          )}
        </CollapsibleSection>

        {/* Income */}
        <CollapsibleSection title="💵 Income">
          <div className="flex gap-2">
            <button
              onClick={() => updateInput('incomeMode', 'detailed')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                inputs.incomeMode === 'detailed'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Detailed
            </button>
            <button
              onClick={() => updateInput('incomeMode', 'net')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                inputs.incomeMode === 'net'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Net Income
            </button>
          </div>

          {inputs.incomeMode === 'detailed' ? (
            <>
              <Input
                label="Monthly Rent"
                type="number"
                prefix="$"
                value={inputs.monthlyRent}
                onChange={(e) => updateInput('monthlyRent', parseFloat(e.target.value) || 0)}
                tooltip="Expected monthly rental income"
              />

              <Input
                label="Vacancy Rate"
                type="number"
                step="0.1"
                suffix="%"
                value={inputs.vacancyRate}
                onChange={(e) => updateInput('vacancyRate', parseFloat(e.target.value) || 0)}
                tooltip="Expected vacancy percentage per year"
                helpText={`$${((inputs.monthlyRent * 12 * inputs.vacancyRate) / 100).toLocaleString()} annual loss`}
              />

              <Input
                label="Other Income"
                type="number"
                prefix="$"
                value={inputs.otherIncome}
                onChange={(e) => updateInput('otherIncome', parseFloat(e.target.value) || 0)}
                tooltip="Laundry, parking, storage, etc. (monthly)"
              />
            </>
          ) : (
            <>
              <Input
                label="Net Monthly Income"
                type="number"
                prefix="$"
                value={inputs.netMonthlyIncome}
                onChange={(e) => updateInput('netMonthlyIncome', parseFloat(e.target.value) || 0)}
                tooltip="Monthly income after management and maintenance"
                helpText="Income after property management fees and maintenance"
              />

              <Input
                label="Utilities & Bills"
                type="number"
                prefix="$"
                value={inputs.utilities}
                onChange={(e) => updateInput('utilities', parseFloat(e.target.value) || 0)}
                tooltip="Monthly utilities and bills paid by owner"
                helpText="This will be subtracted from net income"
              />
            </>
          )}
        </CollapsibleSection>

        {/* Operating Expenses */}
        {inputs.incomeMode === 'detailed' && (
          <CollapsibleSection title="📉 Operating Expenses">
            <Input
              label="Property Tax"
              type="number"
              prefix="$"
              value={inputs.propertyTax}
              onChange={(e) => updateInput('propertyTax', parseFloat(e.target.value) || 0)}
              tooltip="Annual property tax"
              helpText={inputs.isPITI ? "per year (excluded if PITI checked)" : "per year"}
            />

            <Input
              label="Insurance"
              type="number"
              prefix="$"
              value={inputs.insurance}
              onChange={(e) => updateInput('insurance', parseFloat(e.target.value) || 0)}
              tooltip="Annual insurance premium"
              helpText={inputs.isPITI ? "per year (excluded if PITI checked)" : "per year"}
            />

            <Input
              label="HOA Fees"
              type="number"
              prefix="$"
              value={inputs.hoaFees}
              onChange={(e) => updateInput('hoaFees', parseFloat(e.target.value) || 0)}
              tooltip="Monthly HOA fees (if applicable)"
              helpText="per month"
            />

            <Input
              label="Utilities"
              type="number"
              prefix="$"
              value={inputs.utilities}
              onChange={(e) => updateInput('utilities', parseFloat(e.target.value) || 0)}
              tooltip="Monthly utilities paid by owner"
              helpText="per month (if not tenant-paid)"
            />

            <Input
              label="Maintenance"
              type="number"
              step="0.1"
              suffix="%"
              value={inputs.maintenancePercent}
              onChange={(e) => updateInput('maintenancePercent', parseFloat(e.target.value) || 0)}
              tooltip="Maintenance as % of monthly rent"
              helpText={`$${((inputs.monthlyRent * inputs.maintenancePercent) / 100).toLocaleString()}/month`}
            />

            <Input
              label="Property Management"
              type="number"
              step="0.1"
              suffix="%"
              value={inputs.managementPercent}
              onChange={(e) => updateInput('managementPercent', parseFloat(e.target.value) || 0)}
              tooltip="Management fee as % of monthly rent"
              helpText={`$${((inputs.monthlyRent * inputs.managementPercent) / 100).toLocaleString()}/month`}
            />

            <Input
              label="CapEx Reserve"
              type="number"
              step="0.1"
              suffix="%"
              value={inputs.capexPercent}
              onChange={(e) => updateInput('capexPercent', parseFloat(e.target.value) || 0)}
              tooltip="Capital expenditure reserve as % of monthly rent"
              helpText={`$${((inputs.monthlyRent * inputs.capexPercent) / 100).toLocaleString()}/month for major repairs`}
            />
          </CollapsibleSection>
        )}

        {/* Growth Projections */}
        <CollapsibleSection title="📈 Growth Projections" defaultOpen={false}>
          <div className="flex gap-2">
            {[5, 10, 20, 30].map((years) => (
              <button
                key={years}
                onClick={() => updateInput('analysisPeriod', years)}
                className={`flex-1 px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                  inputs.analysisPeriod === years
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {years}yr
              </button>
            ))}
          </div>

          <Input
            label="Property Appreciation"
            type="number"
            step="0.1"
            suffix="%"
            value={inputs.appreciationRate}
            onChange={(e) => updateInput('appreciationRate', parseFloat(e.target.value) || 0)}
            tooltip="Expected annual property value growth"
            helpText="Historical average: 3-4%"
          />

          <Input
            label="Rent Growth"
            type="number"
            step="0.1"
            suffix="%"
            value={inputs.rentGrowthRate}
            onChange={(e) => updateInput('rentGrowthRate', parseFloat(e.target.value) || 0)}
            tooltip="Expected annual rent increase"
            helpText="Typical: 2-3%"
          />

          <Input
            label="Expense Growth"
            type="number"
            step="0.1"
            suffix="%"
            value={inputs.expenseGrowthRate}
            onChange={(e) => updateInput('expenseGrowthRate', parseFloat(e.target.value) || 0)}
            tooltip="Expected annual expense increase"
            helpText="Typically matches inflation: 2-3%"
          />
        </CollapsibleSection>

        {/* Tax & Opportunity */}
        <CollapsibleSection title="🧾 Tax & Opportunity Cost" defaultOpen={false}>
          <Input
            label="Tax Bracket"
            type="number"
            suffix="%"
            value={inputs.taxBracket}
            onChange={(e) => updateInput('taxBracket', parseFloat(e.target.value) || 0)}
            tooltip="Your marginal tax bracket"
            helpText="Federal rate (22%, 24%, 32%, etc.)"
          />

          <Input
            label="Depreciation Period"
            type="number"
            suffix="years"
            value={inputs.depreciationPeriod}
            onChange={(e) => updateInput('depreciationPeriod', parseFloat(e.target.value) || 0)}
            tooltip="IRS residential property depreciation period"
            helpText="27.5 years for residential rental"
          />

          <Input
            label="Building Value"
            type="number"
            suffix="%"
            value={inputs.buildingValuePercent}
            onChange={(e) => updateInput('buildingValuePercent', parseFloat(e.target.value) || 0)}
            tooltip="Building vs. land value (only building depreciates)"
            helpText="Typical: 80% building, 20% land"
          />

          <Input
            label="Alternative Return"
            type="number"
            step="0.1"
            suffix="%"
            value={inputs.alternativeReturn}
            onChange={(e) => updateInput('alternativeReturn', parseFloat(e.target.value) || 0)}
            tooltip="Expected return if investing elsewhere"
            helpText="S&P 500 historical: ~7%"
          />

          <Input
            label="Selling Costs"
            type="number"
            step="0.1"
            suffix="%"
            value={inputs.sellingCosts}
            onChange={(e) => updateInput('sellingCosts', parseFloat(e.target.value) || 0)}
            tooltip="Real estate commissions and closing costs when selling"
            helpText="Typical: 6% (realtor fees)"
          />
        </CollapsibleSection>
      </div>
    </Card>
  );
}
