/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { OverviewTab } from './components/overview/OverviewTab';
import { DesignsTab } from './components/designs/DesignsTab';
import { ProductionTab } from './components/production/ProductionTab';
import { ComparisonTab } from './components/comparison/ComparisonTab';
import { QualityTab } from './components/quality/QualityTab';
import { ErgonomicsTab } from './components/ergonomics/ErgonomicsTab';
import { CostBenefitTab } from './components/economics/CostBenefitTab';
import { FieldTrialsTab } from './components/trials/FieldTrialsTab';
import { ArtisanVendorTab } from './components/network/ArtisanVendorTab';
import { ReportsTab } from './components/reports/ReportsTab';
import { SettingsTab } from './components/settings/SettingsTab';
import { NewSessionModal } from './components/production/NewSessionModal';

const MainContent: React.FC = () => {
  const { currentTab } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  const renderActiveTab = () => {
    switch (currentTab) {
      case 'overview':
        return <OverviewTab />;
      case 'designs':
        return <DesignsTab />;
      case 'production':
        return <ProductionTab />;
      case 'comparison':
        return <ComparisonTab />;
      case 'quality':
        return <QualityTab />;
      case 'ergonomics':
        return <ErgonomicsTab />;
      case 'economics':
        return <CostBenefitTab />;
      case 'trials':
        return <FieldTrialsTab />;
      case 'network':
        return <ArtisanVendorTab />;
      case 'reports':
        return <ReportsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F7F3E8] text-[#29312D] overflow-hidden">
      {/* Sidebar (Desktop fixed, Mobile drawer) */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header onOpenMobileMenu={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {renderActiveTab()}
        </main>
      </div>

      {/* Global New Session Modal */}
      <NewSessionModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
