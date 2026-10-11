import React, { useState } from 'react';
import {
  Coins,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateBOMCost,
  calculateTotalManufacturingCost,
  calculateEconomicProjections,
  formatInr,
  calculateProductionRate,
} from '../../utils/calculations';

export const CostBenefitTab: React.FC = () => {
  const { state, updateCostInputs } = useApp();
  const [scenario, setScenario] = useState<'low' | 'base' | 'high'>('base');

  // Obtain empirical rates from sessions for accurate economic baseline
  const refSessions = state.sessions.filter((s) => s.designId === 'ref-amber-8spindle');
  const protoSessions = state.sessions.filter((s) => s.designId === 'proto-sutrasetu-v1');

  const refGrams = refSessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);
  const refMins = refSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const refRate = refMins > 0 ? calculateProductionRate(refGrams, refMins) : 48.5;

  const protoGrams = protoSessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);
  const protoMins = protoSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const protoRate = protoMins > 0 ? calculateProductionRate(protoGrams, protoMins) : 84.2;

  const { costInputs } = state;
  const bomCost = calculateBOMCost(costInputs);
  const totalCapex = calculateTotalManufacturingCost(costInputs);

  const baselineRefCapex = 8500; // Baseline traditional Ambar Charkha acquisition cost
  const capexDifference = totalCapex - baselineRefCapex;

  const projection = calculateEconomicProjections(costInputs, protoRate, refRate, scenario);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#68736C]">
            <span>SIH26020 Techno-Economic Analysis</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#367A57] font-semibold">MSME Feasibility Model</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#29312D] mt-0.5">
            Manufacturing Cost & Artisan Livelihood Benefit Model
          </h2>
          <p className="text-xs text-[#68736C]">
            Transparent bill-of-materials accounting, operating margins, and payback estimation across sensitivity scenarios
          </p>
        </div>

        {/* Scenario Toggle */}
        <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 border border-[#E5E0D5] rounded-lg self-start md:self-auto">
          <span className="text-[10px] uppercase font-mono px-2 text-[#68736C] font-semibold">
            Sensitivity:
          </span>
          <button
            onClick={() => setScenario('low')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              scenario === 'low'
                ? 'bg-[#243B53] text-white shadow-xs'
                : 'text-[#68736C] hover:text-[#29312D]'
            }`}
          >
            Conservative (0.8x)
          </button>
          <button
            onClick={() => setScenario('base')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              scenario === 'base'
                ? 'bg-[#243B53] text-white shadow-xs'
                : 'text-[#68736C] hover:text-[#29312D]'
            }`}
          >
            Base Case (1.0x)
          </button>
          <button
            onClick={() => setScenario('high')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              scenario === 'high'
                ? 'bg-[#243B53] text-white shadow-xs'
                : 'text-[#68736C] hover:text-[#29312D]'
            }`}
          >
            Optimistic (1.2x)
          </button>
        </div>
      </div>

      {/* Primary KPI Results Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Manufacturing Cost */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <span className="text-[10px] text-[#68736C] uppercase font-mono block">
            Total Unit Mfg Cost
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#243B53] mt-1">
            {formatInr(totalCapex)}
          </div>
          <div className="text-[11px] text-[#829AB1] mt-1">
            BOM: {formatInr(bomCost)} + Labor
          </div>
        </div>

        {/* Monthly Net Artisan Income */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <span className="text-[10px] text-[#68736C] uppercase font-mono block">
            Estimated Monthly Net Earnings
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#367A57] mt-1">
            {formatInr(projection.prototypeMonthlyNetIncomeInr)}
          </div>
          <div className="text-[11px] text-[#367A57] mt-1 font-semibold">
            vs {formatInr(projection.referenceMonthlyNetIncomeInr)} baseline
          </div>
        </div>

        {/* Incremental Monthly Benefit */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <span className="text-[10px] text-[#68736C] uppercase font-mono block">
            Monthly Incremental Gain
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#B65D3A] mt-1">
            +{formatInr(projection.monthlyIncrementalIncomeInr)}
          </div>
          <div className="text-[11px] text-[#68736C] mt-1">
            Net livelihood increase / mo
          </div>
        </div>

        {/* Estimated Payback Period */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <span className="text-[10px] text-[#68736C] uppercase font-mono block">
            Incremental Payback
          </span>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#243B53] mt-1">
            {projection.paybackPeriodMonths ? `${projection.paybackPeriodMonths} Months` : 'N/A'}
          </div>
          <div className="text-[11px] text-[#78917B] mt-1 font-semibold">
            Capex recovered from yield
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Editable Inputs on Left, Financial Cascade on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: BOM & Labor Inputs */}
        <div className="space-y-6">
          {/* Bill of Materials (BOM) Section */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <h3 className="font-serif font-bold text-base text-[#29312D]">
                1. Bill of Materials (BOM) Breakdown
              </h3>
              <span className="font-mono text-xs font-bold text-[#243B53]">
                Subtotal: {formatInr(bomCost)}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between gap-4">
                <label className="text-[#68736C] flex-1">
                  Chassis Frame & Structural Brackets (Alloy 6061)
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[#829AB1]">₹</span>
                  <input
                    type="number"
                    value={costInputs.frameAndChassisInr}
                    onChange={(e) =>
                      updateCostInputs({ frameAndChassisInr: Number(e.target.value) })
                    }
                    className="w-24 px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-right text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-[#68736C] flex-1">
                  8-Spindle Precision Rail & Shielded Ceramic Bearings
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[#829AB1]">₹</span>
                  <input
                    type="number"
                    value={costInputs.spindlesAndBearingsInr}
                    onChange={(e) =>
                      updateCostInputs({ spindlesAndBearingsInr: Number(e.target.value) })
                    }
                    className="w-24 px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-right text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-[#68736C] flex-1">
                  Enclosed Dual Planetary Gearbox & Poly-V Belt Drive
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[#829AB1]">₹</span>
                  <input
                    type="number"
                    value={costInputs.gearsFlywheelAndDriveInr}
                    onChange={(e) =>
                      updateCostInputs({ gearsFlywheelAndDriveInr: Number(e.target.value) })
                    }
                    className="w-24 px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-right text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-[#68736C] flex-1">
                  Precision Hardware Fasteners & Spring Tensioners
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[#829AB1]">₹</span>
                  <input
                    type="number"
                    value={costInputs.fastenersAndTensionersInr}
                    onChange={(e) =>
                      updateCostInputs({ fastenersAndTensionersInr: Number(e.target.value) })
                    }
                    className="w-24 px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-right text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between gap-4">
                <label className="text-[#68736C] flex-1">
                  Ergonomic 3-Position Crank & Ball-Bearing Handle
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-[#829AB1]">₹</span>
                  <input
                    type="number"
                    value={costInputs.ergonomicSeatHandleComponentsInr}
                    onChange={(e) =>
                      updateCostInputs({
                        ergonomicSeatHandleComponentsInr: Number(e.target.value),
                      })
                    }
                    className="w-24 px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-right text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Labor & Fabrication Inputs */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#29312D] border-b border-[#F0EBE1] pb-3">
              2. Fabrication, Assembly & Inspection Labor
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#68736C] mb-1">Machining Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={costInputs.machiningAndAssemblyHours}
                  onChange={(e) =>
                    updateCostInputs({ machiningAndAssemblyHours: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[#68736C] mb-1">Labor Rate (₹/hr)</label>
                <input
                  type="number"
                  value={costInputs.laborRatePerHourInr}
                  onChange={(e) =>
                    updateCostInputs({ laborRatePerHourInr: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>

              <div>
                <label className="block text-[#68736C] mb-1">Inspection & Finish (₹)</label>
                <input
                  type="number"
                  value={costInputs.finishingAndQualityInspectionInr}
                  onChange={(e) =>
                    updateCostInputs({
                      finishingAndQualityInspectionInr: Number(e.target.value),
                    })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
            </div>
          </div>

          {/* Operating Assumptions */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-4">
            <h3 className="font-serif font-bold text-base text-[#29312D] border-b border-[#F0EBE1] pb-3">
              3. Village Cluster Operating Assumptions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-[#68736C] mb-1">Days / Month</label>
                <input
                  type="number"
                  value={costInputs.operatingDaysPerMonth}
                  onChange={(e) =>
                    updateCostInputs({ operatingDaysPerMonth: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[#68736C] mb-1">Working Hours/Day</label>
                <input
                  type="number"
                  value={costInputs.dailyWorkingHours}
                  onChange={(e) =>
                    updateCostInputs({ dailyWorkingHours: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[#68736C] mb-1">Yarn Price (₹/kg)</label>
                <input
                  type="number"
                  value={costInputs.sellingPricePerKgYarnInr}
                  onChange={(e) =>
                    updateCostInputs({ sellingPricePerKgYarnInr: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[#68736C] mb-1">Raw Sliver (₹/kg)</label>
                <input
                  type="number"
                  value={costInputs.rawSliverCostPerKgInr}
                  onChange={(e) =>
                    updateCostInputs({ rawSliverCostPerKgInr: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[#68736C] mb-1">Maint/Year (₹)</label>
                <input
                  type="number"
                  value={costInputs.annualMaintenanceInr}
                  onChange={(e) =>
                    updateCostInputs({ annualMaintenanceInr: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
              <div>
                <label className="block text-[#68736C] mb-1">Lifespan (Years)</label>
                <input
                  type="number"
                  value={costInputs.equipmentLifeYears}
                  onChange={(e) =>
                    updateCostInputs({ equipmentLifeYears: Number(e.target.value) })
                  }
                  className="w-full px-2.5 py-1.5 border border-[#E5E0D5] rounded-md font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Cascade & Proof of Work */}
        <div className="space-y-6">
          {/* Monthly Waterfall Model */}
          <div className="bg-[#FAF8F2] p-5 rounded-xl border border-[#E5E0D5] space-y-4">
            <h3 className="font-serif font-bold text-base text-[#29312D] border-b border-[#EAE5D9] pb-3">
              Monthly Economic Waterfall ({scenario.toUpperCase()} Scenario)
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#EAE5D9]">
                <span className="text-[#68736C]">Daily Output (6 hrs spinning)</span>
                <span className="font-mono font-bold text-[#29312D]">
                  {projection.prototypeDailyOutputKg} kg/day{' '}
                  <span className="text-[#829AB1] font-normal">
                    (vs {projection.referenceDailyOutputKg} kg ref)
                  </span>
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#EAE5D9]">
                <span className="text-[#68736C]">Monthly Spun Yarn Output (25 days)</span>
                <span className="font-mono font-bold text-[#29312D]">
                  {projection.monthlyYarnOutputKg} kg
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#EAE5D9]">
                <span className="text-[#68736C]">Gross Yarn Revenue (@ ₹{costInputs.sellingPricePerKgYarnInr}/kg)</span>
                <span className="font-mono font-bold text-[#243B53]">
                  {formatInr(projection.monthlyGrossRevenueInr)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#EAE5D9]">
                <span className="text-[#68736C]">(-) Raw Cotton Sliver Cost (@ ₹{costInputs.rawSliverCostPerKgInr}/kg)</span>
                <span className="font-mono font-bold text-[#B94040]">
                  - {formatInr(projection.monthlyRawMaterialCostInr)}
                </span>
              </div>

              <div className="flex justify-between py-1.5 border-b border-[#EAE5D9]">
                <span className="text-[#68736C]">(-) Monthly Reserve for Maintenance</span>
                <span className="font-mono font-bold text-[#B94040]">
                  - {formatInr(projection.monthlyMaintenanceCostInr)}
                </span>
              </div>

              <div className="flex justify-between py-2.5 bg-white p-3 rounded-lg border border-[#E5E0D5]">
                <span className="font-bold text-[#29312D]">Estimated Artisan Net Monthly Livelihood:</span>
                <span className="font-mono font-bold text-base text-[#367A57]">
                  {formatInr(projection.prototypeMonthlyNetIncomeInr)}
                </span>
              </div>

              <div className="flex justify-between py-2 bg-[#EBF1F5] p-3 rounded-lg border border-[#334E68]/20">
                <span className="font-bold text-[#243B53]">Monthly Incremental Gain over Traditional Charkha:</span>
                <span className="font-mono font-bold text-base text-[#B65D3A]">
                  +{formatInr(projection.monthlyIncrementalIncomeInr)} / mo
                </span>
              </div>

              <div className="flex justify-between py-1.5 text-[11px] text-[#68736C]">
                <span>Annual Net Livelihood Addition:</span>
                <span className="font-mono font-bold text-[#29312D]">
                  +{formatInr(projection.annualNetBenefitInr)} / year
                </span>
              </div>
            </div>
          </div>

          {/* Payback Calculation Formula Card */}
          <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#29312D]">
              Payback Period Formula & Assumptions
            </h4>
            <div className="p-3 bg-[#FAF8F2] rounded-lg font-mono text-xs text-[#243B53] space-y-1">
              <p>Payback Period (Months) = Total Equipment Capex ÷ Incremental Monthly Gain</p>
              <p className="text-[#B65D3A]">
                = {formatInr(totalCapex)} ÷ {formatInr(projection.monthlyIncrementalIncomeInr)}
              </p>
              <p className="font-bold text-[#367A57]">
                = {projection.paybackPeriodMonths || 'N/A'} Months
              </p>
            </div>
            <p className="text-xs text-[#68736C] leading-relaxed">
              Under base assumptions, an artisan or self-help group recoups the full hardware investment in approximately{' '}
              <strong>{projection.paybackPeriodMonths} months</strong> through increased daily throughput, after which the additional income flows directly to household livelihood.
            </p>
          </div>

          {/* Economic Projections Disclaimer */}
          <div className="bg-[#FAF8F2] p-4 rounded-xl border border-[#E5E0D5] text-xs text-[#68736C] space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-[#29312D]">
              <AlertCircle className="w-3.5 h-3.5 text-[#B65D3A]" />
              <span>Economic Model Disclaimer</span>
            </div>
            <p className="leading-relaxed">
              Calculated figures are mathematical projections based on user-entered sliver and yarn market rates. They do not constitute guaranteed artisan wages. Final earnings depend on local Khadi Sanstha procurement schemes and sliver availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
