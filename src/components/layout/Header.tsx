import React from 'react';
import { Menu, Plus, GitCompare, RefreshCw, AlertCircle, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface HeaderProps {
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { currentTab, setCurrentTab, setIsNewSessionModalOpen, loadDemoData } = useApp();

  const getPageTitle = () => {
    switch (currentTab) {
      case 'overview':
        return 'Overview Dashboard';
      case 'designs':
        return 'Charkha Design Registry';
      case 'production':
        return 'Spinning Production Tracker';
      case 'comparison':
        return 'Performance & Ergonomics Comparison';
      case 'quality':
        return 'Yarn Quality Evaluation';
      case 'ergonomics':
        return 'Ergonomics & Operator Comfort';
      case 'economics':
        return 'Cost & Benefit Calculator';
      case 'trials':
        return 'Field Trials & Deployment Roadmap';
      case 'network':
        return 'Artisan & Vendor Network';
      case 'reports':
        return 'Reports & Data Export';
      case 'settings':
        return 'Settings & System Documentation';
      default:
        return 'SutraSetu';
    }
  };

  return (
    <header className="bg-white border-b border-[#E5E0D5] sticky top-0 z-20 shadow-xs">
      {/* Top SIH Notice Bar */}
      <div className="bg-[#243B53] text-[#F7F3E8] px-4 py-1.5 text-xs flex flex-wrap items-center justify-between gap-2 border-b border-[#334E68]">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#F7F3E8] tracking-wide">
            SIH26020
          </span>
          <span className="text-[#829AB1] hidden sm:inline">|</span>
          <span className="text-[#BAC7D5] truncate max-w-[280px] sm:max-w-md">
            Ministry of MSME · Innovative Hand-Spinning Equipment for Khadi Artisans
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#BAC7D5]">
          <span className="inline-flex items-center gap-1 bg-[#1B2D3F] px-2 py-0.5 rounded text-[#78917B]">
            <Info className="w-3 h-3 text-[#78917B]" />
            Hardware Companion Suite
          </span>
        </div>
      </div>

      {/* Main Header Action Bar */}
      <div className="px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#243B53] hover:bg-[#F7F3E8] focus:outline-none"
            aria-label="Open mobile menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#29312D] tracking-tight">
              {getPageTitle()}
            </h1>
            <p className="text-xs text-[#68736C] hidden sm:block">
              Recording measurements, validating ergonomics & empowering rural Khadi livelihoods.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setCurrentTab('comparison')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-colors ${
              currentTab === 'comparison'
                ? 'bg-[#243B53] text-white border-[#243B53]'
                : 'bg-white text-[#243B53] border-[#E5E0D5] hover:bg-[#F7F3E8]'
            }`}
          >
            <GitCompare className="w-3.5 h-3.5" />
            <span>Compare Charkhas</span>
          </button>

          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#B65D3A] hover:bg-[#9E4D2D] text-white shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>New Session</span>
          </button>

          <button
            onClick={loadDemoData}
            title="Reload verified sample demonstration dataset for SIH evaluation"
            className="hidden lg:inline-flex items-center gap-1 px-2.5 py-2 text-xs font-medium text-[#68736C] hover:text-[#29312D] bg-[#F7F3E8] hover:bg-[#EBE5D3] rounded-lg border border-[#E5E0D5] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Demo Data</span>
          </button>
        </div>
      </div>

      {/* Hardware disclaimer banner (quiet & non-intrusive) */}
      <div className="bg-[#FAF8F2] border-t border-[#EAE5D9] px-4 lg:px-8 py-1.5 text-[11px] text-[#68736C] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-[#B65D3A] shrink-0" />
          <span>
            <strong>Hardware Focus:</strong> The physical hand-operated Charkha prototype is the primary deliverable; software supports empirical recording and evaluation.
          </span>
        </div>
        <span className="text-[10px] text-[#78917B] font-mono hidden md:inline">
          Theme: Rural Dev & FoodTech
        </span>
      </div>
    </header>
  );
};
