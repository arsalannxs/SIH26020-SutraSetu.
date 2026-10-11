/**
 * Domain types for SutraSetu — Smart Charkha Performance & Artisan Support Platform
 * SIH Problem Statement ID: SIH26020
 */

export type NavigationSection =
  | 'overview'
  | 'designs'
  | 'production'
  | 'comparison'
  | 'quality'
  | 'ergonomics'
  | 'economics'
  | 'trials'
  | 'network'
  | 'reports'
  | 'settings';

export type DesignType = 'reference' | 'prototype';

export type DesignStatus = 'concept' | 'fabrication' | 'testing' | 'validated';

export interface CharkhaDesign {
  id: string;
  name: string;
  type: DesignType;
  revision: string;
  status: DesignStatus;
  description: string;
  intendedImprovements: string[];
  dimensions: {
    lengthCm: number;
    widthCm: number;
    heightCm: number;
  };
  totalWeightKg: number;
  frameMaterial: string;
  driveMechanism: string;
  spindleCount: number;
  gearRatio: string;
  portabilityNotes: string;
  assemblyTimeMinutes: number;
  estimatedManufacturingCostInr: number;
  isSampleData: boolean;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface SpinningSession {
  id: string;
  designId: string;
  artisanOrOperatorId: string;
  artisanName?: string;
  date: string;
  durationMinutes: number; // Stored in minutes, durationHours = durationMinutes / 60
  yarnProducedGrams: number;
  breakCount: number;
  effortRating: number; // 1 (Very Light) to 5 (Severe Strain)
  comfortRating: number; // 1 (Very Uncomfortable) to 5 (Highly Comfortable)
  cottonType: string; // e.g. "Desi Cotton 29mm", "Sujata Organic", "Ambar Sliver Hank 16s"
  consistencyNotes: string;
  environmentNotes?: string; // Temperature / humidity notes
  isSampleData: boolean;
  createdAt: string;
}

export interface YarnQualityRecord {
  id: string;
  designId: string;
  testDate: string;
  assessorName: string;
  sampleLengthMeters: number;
  sampleMassGrams: number;
  measuredNeCount: number; // English Cotton Count Ne: (Length in yards / 840) / Weight in lbs OR (meters / (grams * 1.693))
  twistPerInchTpi: number; // Twists per inch
  evennessRating: number; // 1 (Poor/Lumpy) to 5 (Exceptional Uniformity)
  breaksPerHundredGrams: number;
  defectObservations: string[]; // e.g. ["Minor neps", "Slubs", "Snarls"]
  measurementMethod: string; // e.g., "Wrap Reel + 0.01g Analytical Balance + Manual Twist Counter"
  assessorComments: string;
  isInstrumentMeasured: boolean;
  isSampleData: boolean;
  createdAt: string;
}

export type DiscomfortArea =
  | 'neck'
  | 'upper_back'
  | 'lower_back'
  | 'right_shoulder'
  | 'left_shoulder'
  | 'right_wrist'
  | 'left_wrist'
  | 'knees'
  | 'legs';

export interface ErgonomicRecord {
  id: string;
  designId: string;
  artisanId: string;
  evaluationDate: string;
  workingHeightCm: number; // Bench or seat to crank axis height
  handleReachCm: number;
  crankResistancePerception: number; // 1-5 scale
  postureAssessment: string; // Neutral / Slouched / Asymmetric reach
  perceivedEffortScore: number; // Borg CR10 or 1-5 effort scale
  overallComfortScore: number; // 1-5
  discomfortAreas: DiscomfortArea[];
  continuousSpinningMinutesBeforeFatigue: number;
  assessorNotes: string;
  evaluationMethod: 'Observational Checklist' | 'RPE Borg Scale' | 'Artisan Direct Interview';
  isSampleData: boolean;
  createdAt: string;
}

export interface CostModelInputs {
  // BOM Items
  frameAndChassisInr: number;
  spindlesAndBearingsInr: number;
  gearsFlywheelAndDriveInr: number;
  fastenersAndTensionersInr: number;
  ergonomicSeatHandleComponentsInr: number;
  
  // Labor & Fabrication
  machiningAndAssemblyHours: number;
  laborRatePerHourInr: number;
  finishingAndQualityInspectionInr: number;
  
  // Operating & Commercial Assumptions
  annualMaintenanceInr: number;
  equipmentLifeYears: number;
  operatingDaysPerMonth: number;
  dailyWorkingHours: number;
  sellingPricePerKgYarnInr: number; // Selling price per kg of spun yarn
  rawSliverCostPerKgInr: number; // Raw cotton sliver cost per kg
  artisanWageBaselinePerDayInr: number;
}

export type FieldTrialStatus = 'draft' | 'scheduled' | 'in-progress' | 'completed';

export interface FieldTrial {
  id: string;
  title: string;
  location: string;
  clusterOrOrganization: string;
  designId: string;
  startDate: string;
  endDate?: string;
  participatingArtisansCount: number;
  status: FieldTrialStatus;
  objectives: string[];
  safetyChecklist: {
    item: string;
    checked: boolean;
  }[];
  baselineObservations: string;
  artisanFeedbackSummary: string;
  maintenanceIssuesLogged: string[];
  followUpActions: string;
  responsibleLead: string;
  isSampleData: boolean;
  createdAt: string;
}

export type PartnerType =
  | 'khadi_institution'
  | 'artisan_shg'
  | 'fabrication_workshop'
  | 'component_supplier'
  | 'evaluation_agency';

export type PartnershipStatus = 'inquiry' | 'engaged' | 'active_trial' | 'scale_partner';

export interface ArtisanVendorContact {
  id: string;
  name: string;
  type: PartnerType;
  organizationName: string;
  location: {
    villageOrCity: string;
    district: string;
    state: string;
  };
  contactPerson: string;
  phoneOrEmail?: string;
  capabilitiesOrNeeds: string[];
  partnershipStatus: PartnershipStatus;
  notes: string;
  isSampleData: boolean;
  createdAt: string;
}

export interface AppState {
  designs: CharkhaDesign[];
  sessions: SpinningSession[];
  qualityRecords: YarnQualityRecord[];
  ergonomicRecords: ErgonomicRecord[];
  costInputs: CostModelInputs;
  fieldTrials: FieldTrial[];
  networkContacts: ArtisanVendorContact[];
}
