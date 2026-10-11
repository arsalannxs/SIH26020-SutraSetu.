import React from 'react';
import {
  Compass,
  Cpu,
  Activity,
  GitCompare,
  Sparkles,
  HeartPulse,
  Coins,
  MapPin,
  Users2,
  FileText,
  Settings,
  X,
  Layers,
} from 'lucide-react';
import { NavigationSection } from '../../types';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItem {
  id: NavigationSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number | string;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { currentTab, setCurrentTab, state } = useApp();

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: Compass },
    { id: 'designs', label: 'Charkha Designs', icon: Cpu, badge: state.designs.length },
    { id: 'production', label: 'Production Tracker', icon: Activity, badge: state.sessions.length },
    { id: 'comparison', label: 'Performance Comparison', icon: GitCompare },
    { id: 'quality', label: 'Yarn Quality', icon: Sparkles, badge: state.qualityRecords.length },
    { id: 'ergonomics', label: 'Ergonomics & Comfort', icon: HeartPulse, badge: state.ergonomicRecords.length },
    { id: 'economics', label: 'Cost & Benefits', icon: Coins },
    { id: 'trials', label: 'Field Trials', icon: MapPin, badge: state.fieldTrials.length },
    { id: 'network', label: 'Artisan & Vendor Network', icon: Users2, badge: state.networkContacts.length },
    { id: 'reports', label: 'Reports & Export', icon: FileText },
    { id: 'settings', label: 'Settings & Data', icon: Settings },
  ];

  const handleNavClick = (id: NavigationSection) => {
    setCurrentTab(id);
    setMobileOpen(false);
  };

  const content = (
    <div className="flex flex-col h-full bg-[#243B53] text-[#F7F3E8] select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#334E68] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#B65D3A] flex items-center justify-center text-white shadow-inner font-bold text-lg">
            <Layers className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-tight text-[#F7F3E8]">
                SutraSetu
              </span>
              <span className="text-[10px] tracking-wider uppercase font-mono px-1.5 py-0.5 rounded bg-[#334E68] text-[#E5E0D5]">
                SIH26020
              </span>
            </div>
            <p className="text-xs text-[#BAC7D5] font-light truncate max-w-[170px]">
              Smart Charkha Companion
            </p>
          </div>
        </div>
        {mobileOpen && (
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-[#BAC7D5] hover:text-white p-1 rounded focus:outline-none"
            aria-label="Close sidebar"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Hardware Companion Context Tag */}
      <div className="px-4 py-2.5 bg-[#1B2D3F] border-b border-[#334E68] text-[11px] text-[#BAC7D5] flex items-center justify-between">
        <span className="font-medium text-[#E5E0D5]">Ministry of MSME</span>
        <span className="text-[10px] text-[#78917B] font-mono">Hardware Companion</span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? 'bg-[#B65D3A] text-white shadow-sm font-semibold'
                  : 'text-[#BAC7D5] hover:bg-[#334E68] hover:text-[#F7F3E8]'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-white' : 'text-[#829AB1]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-medium ${
                    isActive
                      ? 'bg-[#8F4426] text-white'
                      : 'bg-[#1B2D3F] text-[#9FB3C8]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Quick Footer info */}
      <div className="p-4 border-t border-[#334E68] bg-[#1B2D3F] text-xs text-[#829AB1]">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-[#D9E2EC]">Khadi Innovation</span>
          <span className="text-[10px] text-[#78917B]">v1.4 Ready</span>
        </div>
        <p className="text-[11px] text-[#829AB1] leading-relaxed">
          Physical Charkha Hardware & Field Trial Evaluation Tool.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden md:block w-64 lg:w-72 shrink-0 border-r border-[#E5E0D5] h-screen sticky top-0 z-30">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
