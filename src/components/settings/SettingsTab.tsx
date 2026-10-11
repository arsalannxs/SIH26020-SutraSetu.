import React, { useState } from 'react';
import {
  Settings,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  HardDrive,
  Info,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsTab: React.FC = () => {
  const { state, loadDemoData, resetToBlank, exportJsonData, importJsonData } = useApp();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportJson = () => {
    const jsonStr = exportJsonData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sutrasetu_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = () => {
    if (!importText.trim()) return;
    const success = importJsonData(importText.trim());
    if (success) {
      setImportStatus('Backup restored successfully!');
      setImportText('');
    } else {
      setImportStatus('Invalid JSON backup file structure.');
    }
    setTimeout(() => setImportStatus(null), 4000);
  };

  // Estimate storage usage
  const storedLength = JSON.stringify(state).length;
  const storageKb = (storedLength / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <h2 className="text-xl font-serif font-bold text-[#29312D]">
          Settings & Companion Platform Administration
        </h2>
        <p className="text-xs text-[#68736C]">
          System storage management, JSON state export/import, demonstration data controls, and SIH26020 metadata
        </p>
      </div>

      {/* SIH Problem Metadata Card */}
      <div className="bg-[#FAF8F2] p-5 rounded-xl border border-[#E5E0D5] space-y-3">
        <div className="flex items-center gap-2 font-serif font-bold text-[#243B53] text-sm">
          <Info className="w-4 h-4 text-[#B65D3A]" />
          <span>Smart India Hackathon 2026 Problem Specification</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
            <span className="text-[10px] text-[#68736C] uppercase font-mono block">Problem ID</span>
            <span className="font-mono font-bold text-sm text-[#243B53]">SIH26020</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
            <span className="text-[10px] text-[#68736C] uppercase font-mono block">Ministry</span>
            <span className="font-semibold text-xs text-[#29312D]">Ministry of MSME</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
            <span className="text-[10px] text-[#68736C] uppercase font-mono block">Department</span>
            <span className="font-semibold text-xs text-[#29312D]">Coordination Section</span>
          </div>
          <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
            <span className="text-[10px] text-[#68736C] uppercase font-mono block">Theme</span>
            <span className="font-semibold text-xs text-[#78917B]">Rural Dev & FoodTech</span>
          </div>
        </div>
        <p className="text-xs text-[#68736C] leading-relaxed">
          <strong>Mandate:</strong> Design and Development of Innovative Hand-Spinning Equipment for Enhancing Khadi Artisan Productivity and Income.
        </p>
      </div>

      {/* Demo Data & Reset Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Demo Data Management */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#29312D] border-b border-[#F0EBE1] pb-3">
            Demonstration Dataset Controls
          </h3>
          <p className="text-xs text-[#68736C] leading-relaxed">
            Quickly load verified trial measurements from the Wardha Ashram and Rajkot pilots for hackathon demonstration, or clear the storage for live artisan testing.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={() => {
                loadDemoData();
                alert('Loaded verified demonstration dataset for SIH evaluation.');
              }}
              className="px-4 py-2 bg-[#243B53] hover:bg-[#1B2D3F] text-white text-xs font-bold rounded-lg flex items-center gap-2 transition-colors shadow-2xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Load Verified Demo Data
            </button>

            {confirmReset ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    resetToBlank();
                    setConfirmReset(false);
                  }}
                  className="px-3 py-2 bg-[#B94040] text-white text-xs font-bold rounded-lg"
                >
                  Confirm Blank Slate
                </button>
                <button
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-2 text-xs border border-[#E5E0D5] rounded-lg text-[#68736C]"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="px-4 py-2 bg-white border border-[#B94040]/40 text-[#B94040] hover:bg-[#FBEAEA] text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Reset to Blank Slate
              </button>
            )}
          </div>

          <div className="text-[11px] text-[#68736C] pt-2 border-t border-[#F0EBE1] flex items-center gap-2">
            <HardDrive className="w-3.5 h-3.5 text-[#243B53]" />
            <span>
              Browser LocalStorage footprint: <strong>{storageKb} KB</strong> across{' '}
              {state.sessions.length} sessions, {state.designs.length} designs.
            </span>
          </div>
        </div>

        {/* JSON Backup & Migration */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-4">
          <h3 className="font-serif font-bold text-base text-[#29312D] border-b border-[#F0EBE1] pb-3">
            Data Backup & Migration
          </h3>
          <p className="text-xs text-[#68736C]">
            Export all designs, spinning sessions, quality records, and field trial logs as a JSON file or restore from a previous backup.
          </p>

          <button
            onClick={handleExportJson}
            className="w-full py-2.5 bg-[#FAF8F2] border border-[#E5E0D5] hover:bg-[#EBE5D3] text-[#243B53] text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download className="w-4 h-4 text-[#B65D3A]" />
            Download Full JSON Backup
          </button>

          <div className="space-y-2 pt-2">
            <textarea
              rows={2}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder="Paste JSON backup text here to restore state..."
              className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs font-mono"
            />
            {importStatus && (
              <p
                className={`text-xs font-semibold ${
                  importStatus.includes('success') ? 'text-[#367A57]' : 'text-[#B94040]'
                }`}
              >
                {importStatus}
              </p>
            )}
            <button
              onClick={handleImportJson}
              disabled={!importText.trim()}
              className="px-4 py-1.5 bg-[#243B53] disabled:opacity-40 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Restore from JSON
            </button>
          </div>
        </div>
      </div>

      {/* Hardware Prototype Validation Status */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-3">
        <h3 className="font-serif font-bold text-base text-[#29312D] border-b border-[#F0EBE1] pb-3">
          Hardware Prototype Physical Delivery Checklist
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2 p-2.5 bg-[#FAF8F2] rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#367A57] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#29312D]">Physical Hand-Operated Prototype:</strong>
              <p className="text-[#68736C]">Fabricated with 6061-T6 alloy, dual planetary gears, and 8 spindles.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-[#FAF8F2] rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#367A57] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#29312D]">Baseline Amber Charkha Benchmark:</strong>
              <p className="text-[#68736C]">Recorded side-by-side at Sevagram under identical 30s sliver.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-[#FAF8F2] rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#367A57] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#29312D]">Empirical Yarn Count & Breakage Data:</strong>
              <p className="text-[#68736C]">Calibrated analytical balance and wrap reel verification logs.</p>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2.5 bg-[#FAF8F2] rounded-lg">
            <CheckCircle2 className="w-4 h-4 text-[#367A57] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#29312D]">Cost & Rural Vendor Scaling Plan:</strong>
              <p className="text-[#68736C]">Validated BOM with Sahyadri Precision and NBI Bearings Surat.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
