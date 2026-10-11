import { CostModelInputs } from '../types';

/**
 * Calculates hourly production rate in grams per hour.
 * Formula: yarn in grams ÷ session duration in hours
 */
export function calculateProductionRate(grams: number, durationMinutes: number): number {
  if (durationMinutes <= 0 || grams <= 0) return 0;
  const hours = durationMinutes / 60;
  return Number((grams / hours).toFixed(2));
}

/**
 * Calculates English Cotton Count (Ne).
 * 1 Ne corresponds to 840 yards per pound.
 * In metric units: Ne = Length (meters) / (Mass (grams) * 1.6933)
 */
export function calculateNeCount(sampleLengthMeters: number, sampleMassGrams: number): number {
  if (sampleLengthMeters <= 0 || sampleMassGrams <= 0) return 0;
  const ne = sampleLengthMeters / (sampleMassGrams * 1.6933);
  return Number(ne.toFixed(2));
}

/**
 * Calculates percentage difference:
 * ((newValue - refValue) / refValue) * 100
 * Handles zero and missing values safely.
 */
export function calculatePercentageChange(
  newValue: number | undefined | null,
  refValue: number | undefined | null
): { value: number; formatted: string; isImprovement: boolean } | null {
  if (
    newValue === undefined ||
    newValue === null ||
    refValue === undefined ||
    refValue === null ||
    refValue === 0
  ) {
    return null;
  }

  const change = ((newValue - refValue) / refValue) * 100;
  return {
    value: Number(change.toFixed(1)),
    formatted: `${change >= 0 ? '+' : ''}${change.toFixed(1)}%`,
    isImprovement: change > 0, // context-specific callers check whether higher or lower is better
  };
}

/**
 * Bill of Materials (BOM) total component cost
 */
export function calculateBOMCost(inputs: CostModelInputs): number {
  return (
    inputs.frameAndChassisInr +
    inputs.spindlesAndBearingsInr +
    inputs.gearsFlywheelAndDriveInr +
    inputs.fastenersAndTensionersInr +
    inputs.ergonomicSeatHandleComponentsInr
  );
}

/**
 * Total estimated prototype manufacturing cost including fabrication labor & finishing
 */
export function calculateTotalManufacturingCost(inputs: CostModelInputs): number {
  const bom = calculateBOMCost(inputs);
  const labor = inputs.machiningAndAssemblyHours * inputs.laborRatePerHourInr;
  const finishing = inputs.finishingAndQualityInspectionInr;
  return bom + labor + finishing;
}

export interface EconomicProjectionResult {
  scenario: 'low' | 'base' | 'high';
  multiplier: number;
  prototypeDailyOutputKg: number;
  referenceDailyOutputKg: number;
  monthlyYarnOutputKg: number;
  monthlyGrossRevenueInr: number;
  monthlyRawMaterialCostInr: number;
  monthlyMaintenanceCostInr: number;
  monthlyGrossMarginInr: number;
  monthlyIncrementalIncomeInr: number;
  referenceMonthlyNetIncomeInr: number;
  prototypeMonthlyNetIncomeInr: number;
  paybackPeriodMonths: number | null;
  annualNetBenefitInr: number;
}

/**
 * Transparent calculation of economic impact, artisan earnings and equipment payback.
 */
export function calculateEconomicProjections(
  inputs: CostModelInputs,
  prototypeGramsPerHour: number,
  refGramsPerHour: number,
  scenario: 'low' | 'base' | 'high' = 'base'
): EconomicProjectionResult {
  // Scenario sensitivity multiplier: Low = 0.8x, Base = 1.0x, High = 1.2x
  const multiplier = scenario === 'low' ? 0.8 : scenario === 'high' ? 1.2 : 1.0;

  const effectiveProtoGramsPerHour = prototypeGramsPerHour * multiplier;
  const effectiveRefGramsPerHour = refGramsPerHour * multiplier;

  const protoDailyKg = (effectiveProtoGramsPerHour * inputs.dailyWorkingHours) / 1000;
  const refDailyKg = (effectiveRefGramsPerHour * inputs.dailyWorkingHours) / 1000;

  const monthlyProtoKg = protoDailyKg * inputs.operatingDaysPerMonth;
  const monthlyRefKg = refDailyKg * inputs.operatingDaysPerMonth;

  // Revenue & Costs for Prototype
  const monthlyGrossRevenueInr = monthlyProtoKg * inputs.sellingPricePerKgYarnInr;
  const monthlyRawMaterialCostInr = monthlyProtoKg * inputs.rawSliverCostPerKgInr;
  const monthlyMaintenanceInr = inputs.annualMaintenanceInr / 12;
  const monthlyGrossMarginInr = monthlyGrossRevenueInr - monthlyRawMaterialCostInr;
  const prototypeMonthlyNetIncomeInr = Math.max(0, monthlyGrossMarginInr - monthlyMaintenanceInr);

  // Revenue & Costs for Reference
  const refMonthlyGrossRevenue = monthlyRefKg * inputs.sellingPricePerKgYarnInr;
  const refMonthlyRawCost = monthlyRefKg * inputs.rawSliverCostPerKgInr;
  const refMonthlyMaintenance = (inputs.annualMaintenanceInr * 0.7) / 12; // Reference charkha baseline maintenance
  const referenceMonthlyNetIncomeInr = Math.max(
    0,
    refMonthlyGrossRevenue - refMonthlyRawCost - refMonthlyMaintenance
  );

  const monthlyIncrementalIncomeInr = prototypeMonthlyNetIncomeInr - referenceMonthlyNetIncomeInr;

  // Payback period for the prototype hardware
  const totalCapexInr = calculateTotalManufacturingCost(inputs);
  let paybackPeriodMonths: number | null = null;
  if (monthlyIncrementalIncomeInr > 0) {
    paybackPeriodMonths = Number((totalCapexInr / monthlyIncrementalIncomeInr).toFixed(1));
  }

  const annualNetBenefitInr = monthlyIncrementalIncomeInr * 12;

  return {
    scenario,
    multiplier,
    prototypeDailyOutputKg: Number(protoDailyKg.toFixed(2)),
    referenceDailyOutputKg: Number(refDailyKg.toFixed(2)),
    monthlyYarnOutputKg: Number(monthlyProtoKg.toFixed(2)),
    monthlyGrossRevenueInr: Math.round(monthlyGrossRevenueInr),
    monthlyRawMaterialCostInr: Math.round(monthlyRawMaterialCostInr),
    monthlyMaintenanceCostInr: Math.round(monthlyMaintenanceInr),
    monthlyGrossMarginInr: Math.round(monthlyGrossMarginInr),
    monthlyIncrementalIncomeInr: Math.round(monthlyIncrementalIncomeInr),
    referenceMonthlyNetIncomeInr: Math.round(referenceMonthlyNetIncomeInr),
    prototypeMonthlyNetIncomeInr: Math.round(prototypeMonthlyNetIncomeInr),
    paybackPeriodMonths,
    annualNetBenefitInr: Math.round(annualNetBenefitInr),
  };
}

export function formatInr(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}
