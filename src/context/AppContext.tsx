import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AppState,
  ArtisanVendorContact,
  CharkhaDesign,
  CostModelInputs,
  ErgonomicRecord,
  FieldTrial,
  NavigationSection,
  SpinningSession,
  YarnQualityRecord,
} from '../types';
import { initialData } from '../data/initialData';

const STORAGE_KEY = 'sutrasetu_state_v1';

interface AppContextType {
  state: AppState;
  currentTab: NavigationSection;
  setCurrentTab: (tab: NavigationSection) => void;
  isNewSessionModalOpen: boolean;
  setIsNewSessionModalOpen: (open: boolean) => void;

  // Designs
  addDesign: (design: Omit<CharkhaDesign, 'id' | 'createdAt' | 'updatedAt' | 'isSampleData'>) => void;
  updateDesign: (id: string, updates: Partial<CharkhaDesign>) => void;
  deleteDesign: (id: string) => void;

  // Sessions
  addSession: (session: Omit<SpinningSession, 'id' | 'createdAt' | 'isSampleData'>) => void;
  updateSession: (id: string, updates: Partial<SpinningSession>) => void;
  deleteSession: (id: string) => void;

  // Yarn Quality
  addQualityRecord: (record: Omit<YarnQualityRecord, 'id' | 'createdAt' | 'isSampleData'>) => void;
  updateQualityRecord: (id: string, updates: Partial<YarnQualityRecord>) => void;
  deleteQualityRecord: (id: string) => void;

  // Ergonomics
  addErgonomicRecord: (record: Omit<ErgonomicRecord, 'id' | 'createdAt' | 'isSampleData'>) => void;
  updateErgonomicRecord: (id: string, updates: Partial<ErgonomicRecord>) => void;
  deleteErgonomicRecord: (id: string) => void;

  // Cost Inputs
  updateCostInputs: (inputs: Partial<CostModelInputs>) => void;

  // Field Trials
  addFieldTrial: (trial: Omit<FieldTrial, 'id' | 'createdAt' | 'isSampleData'>) => void;
  updateFieldTrial: (id: string, updates: Partial<FieldTrial>) => void;
  deleteFieldTrial: (id: string) => void;
  toggleTrialChecklist: (trialId: string, index: number) => void;

  // Contacts
  addContact: (contact: Omit<ArtisanVendorContact, 'id' | 'createdAt' | 'isSampleData'>) => void;
  updateContact: (id: string, updates: Partial<ArtisanVendorContact>) => void;
  deleteContact: (id: string) => void;

  // State maintenance
  loadDemoData: () => void;
  resetToBlank: () => void;
  importJsonData: (json: string) => boolean;
  exportJsonData: () => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTab, setCurrentTab] = useState<NavigationSection>('overview');
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);

  const [state, setState] = useState<AppState>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.designs && parsed.sessions && parsed.costInputs) {
          return parsed;
        }
      }
    } catch {
      // ignore parse errors and fallback
    }
    return initialData;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save to localStorage', err);
    }
  }, [state]);

  const addDesign = (data: Omit<CharkhaDesign, 'id' | 'createdAt' | 'updatedAt' | 'isSampleData'>) => {
    const newDesign: CharkhaDesign = {
      ...data,
      id: `design-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSampleData: false,
    };
    setState((prev) => ({
      ...prev,
      designs: [newDesign, ...prev.designs],
    }));
  };

  const updateDesign = (id: string, updates: Partial<CharkhaDesign>) => {
    setState((prev) => ({
      ...prev,
      designs: prev.designs.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d
      ),
    }));
  };

  const deleteDesign = (id: string) => {
    setState((prev) => ({
      ...prev,
      designs: prev.designs.filter((d) => d.id !== id),
      // also cascade or keep sessions safely
    }));
  };

  const addSession = (data: Omit<SpinningSession, 'id' | 'createdAt' | 'isSampleData'>) => {
    const newSession: SpinningSession = {
      ...data,
      id: `ses-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isSampleData: false,
    };
    setState((prev) => ({
      ...prev,
      sessions: [newSession, ...prev.sessions],
    }));
  };

  const updateSession = (id: string, updates: Partial<SpinningSession>) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }));
  };

  const deleteSession = (id: string) => {
    setState((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== id),
    }));
  };

  const addQualityRecord = (data: Omit<YarnQualityRecord, 'id' | 'createdAt' | 'isSampleData'>) => {
    const newRecord: YarnQualityRecord = {
      ...data,
      id: `qual-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isSampleData: false,
    };
    setState((prev) => ({
      ...prev,
      qualityRecords: [newRecord, ...prev.qualityRecords],
    }));
  };

  const updateQualityRecord = (id: string, updates: Partial<YarnQualityRecord>) => {
    setState((prev) => ({
      ...prev,
      qualityRecords: prev.qualityRecords.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    }));
  };

  const deleteQualityRecord = (id: string) => {
    setState((prev) => ({
      ...prev,
      qualityRecords: prev.qualityRecords.filter((q) => q.id !== id),
    }));
  };

  const addErgonomicRecord = (data: Omit<ErgonomicRecord, 'id' | 'createdAt' | 'isSampleData'>) => {
    const newRecord: ErgonomicRecord = {
      ...data,
      id: `ergo-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isSampleData: false,
    };
    setState((prev) => ({
      ...prev,
      ergonomicRecords: [newRecord, ...prev.ergonomicRecords],
    }));
  };

  const updateErgonomicRecord = (id: string, updates: Partial<ErgonomicRecord>) => {
    setState((prev) => ({
      ...prev,
      ergonomicRecords: prev.ergonomicRecords.map((e) => (e.id === id ? { ...e, ...updates } : e)),
    }));
  };

  const deleteErgonomicRecord = (id: string) => {
    setState((prev) => ({
      ...prev,
      ergonomicRecords: prev.ergonomicRecords.filter((e) => e.id !== id),
    }));
  };

  const updateCostInputs = (inputs: Partial<CostModelInputs>) => {
    setState((prev) => ({
      ...prev,
      costInputs: { ...prev.costInputs, ...inputs },
    }));
  };

  const addFieldTrial = (data: Omit<FieldTrial, 'id' | 'createdAt' | 'isSampleData'>) => {
    const newTrial: FieldTrial = {
      ...data,
      id: `trial-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isSampleData: false,
    };
    setState((prev) => ({
      ...prev,
      fieldTrials: [newTrial, ...prev.fieldTrials],
    }));
  };

  const updateFieldTrial = (id: string, updates: Partial<FieldTrial>) => {
    setState((prev) => ({
      ...prev,
      fieldTrials: prev.fieldTrials.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  };

  const deleteFieldTrial = (id: string) => {
    setState((prev) => ({
      ...prev,
      fieldTrials: prev.fieldTrials.filter((t) => t.id !== id),
    }));
  };

  const toggleTrialChecklist = (trialId: string, index: number) => {
    setState((prev) => ({
      ...prev,
      fieldTrials: prev.fieldTrials.map((t) => {
        if (t.id !== trialId) return t;
        const newChecklist = [...t.safetyChecklist];
        if (newChecklist[index]) {
          newChecklist[index] = {
            ...newChecklist[index],
            checked: !newChecklist[index].checked,
          };
        }
        return { ...t, safetyChecklist: newChecklist };
      }),
    }));
  };

  const addContact = (data: Omit<ArtisanVendorContact, 'id' | 'createdAt' | 'isSampleData'>) => {
    const newContact: ArtisanVendorContact = {
      ...data,
      id: `net-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isSampleData: false,
    };
    setState((prev) => ({
      ...prev,
      networkContacts: [newContact, ...prev.networkContacts],
    }));
  };

  const updateContact = (id: string, updates: Partial<ArtisanVendorContact>) => {
    setState((prev) => ({
      ...prev,
      networkContacts: prev.networkContacts.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    }));
  };

  const deleteContact = (id: string) => {
    setState((prev) => ({
      ...prev,
      networkContacts: prev.networkContacts.filter((c) => c.id !== id),
    }));
  };

  const loadDemoData = () => {
    setState(initialData);
  };

  const resetToBlank = () => {
    setState({
      designs: [],
      sessions: [],
      qualityRecords: [],
      ergonomicRecords: [],
      costInputs: {
        frameAndChassisInr: 0,
        spindlesAndBearingsInr: 0,
        gearsFlywheelAndDriveInr: 0,
        fastenersAndTensionersInr: 0,
        ergonomicSeatHandleComponentsInr: 0,
        machiningAndAssemblyHours: 0,
        laborRatePerHourInr: 0,
        finishingAndQualityInspectionInr: 0,
        annualMaintenanceInr: 0,
        equipmentLifeYears: 5,
        operatingDaysPerMonth: 25,
        dailyWorkingHours: 6,
        sellingPricePerKgYarnInr: 500,
        rawSliverCostPerKgInr: 220,
        artisanWageBaselinePerDayInr: 250,
      },
      fieldTrials: [],
      networkContacts: [],
    });
  };

  const importJsonData = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed && Array.isArray(parsed.designs) && Array.isArray(parsed.sessions)) {
        setState(parsed);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const exportJsonData = (): string => {
    return JSON.stringify(state, null, 2);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        currentTab,
        setCurrentTab,
        isNewSessionModalOpen,
        setIsNewSessionModalOpen,
        addDesign,
        updateDesign,
        deleteDesign,
        addSession,
        updateSession,
        deleteSession,
        addQualityRecord,
        updateQualityRecord,
        deleteQualityRecord,
        addErgonomicRecord,
        updateErgonomicRecord,
        deleteErgonomicRecord,
        updateCostInputs,
        addFieldTrial,
        updateFieldTrial,
        deleteFieldTrial,
        toggleTrialChecklist,
        addContact,
        updateContact,
        deleteContact,
        loadDemoData,
        resetToBlank,
        importJsonData,
        exportJsonData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
