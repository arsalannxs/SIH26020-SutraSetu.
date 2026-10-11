import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  Users,
  Shield,
  Trash2,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { FieldTrial, FieldTrialStatus } from '../../types';

export const FieldTrialsTab: React.FC = () => {
  const { state, addFieldTrial, updateFieldTrial, deleteFieldTrial, toggleTrialChecklist } =
    useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrial, setSelectedTrial] = useState<FieldTrial | null>(
    state.fieldTrials[0] || null
  );

  // Form state
  const [formData, setFormData] = useState<{
    title: string;
    location: string;
    clusterOrOrganization: string;
    designId: string;
    startDate: string;
    endDate: string;
    participatingArtisansCount: number;
    status: FieldTrialStatus;
    objectives: string;
    baselineObservations: string;
    artisanFeedbackSummary: string;
    maintenanceIssues: string;
    followUpActions: string;
    responsibleLead: string;
  }>({
    title: '',
    location: 'Sevagram Khadi Cluster, Wardha, Maharashtra',
    clusterOrOrganization: 'Gram Sewa Mandal Wardha',
    designId: state.designs[0]?.id || 'proto-sutrasetu-v1',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    participatingArtisansCount: 8,
    status: 'in-progress',
    objectives:
      'Evaluate planetary drive torque\nMeasure artisan break rate\nGather qualitative comfort feedback',
    baselineObservations: 'Traditional Ambar charkha baseline: 48 g/hr average with 4 breaks/hr.',
    artisanFeedbackSummary: 'Spinners reported significant reduction in shoulder tension.',
    maintenanceIssues: 'Check poly-v belt tension after 30 cumulative operating hours.',
    followUpActions: 'Log 10-day sheets and verify ceramic spindle bearing tolerances.',
    responsibleLead: 'Er. Rajesh Kulkarni (Mechanical Lead)',
  });

  const handleOpenAdd = () => {
    setFormData({
      title: 'New Rural Cluster Trial',
      location: '',
      clusterOrOrganization: '',
      designId: state.designs[0]?.id || 'proto-sutrasetu-v1',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      participatingArtisansCount: 6,
      status: 'scheduled',
      objectives: 'Evaluate manual effort\nRecord yarn consistency\nGather artisan feedback',
      baselineObservations: 'Baseline records from cluster Ambar units.',
      artisanFeedbackSummary: '',
      maintenanceIssues: '',
      followUpActions: 'Conduct safety checklist prior to first trial day.',
      responsibleLead: 'Cluster Field Officer',
    });
    setIsModalOpen(true);
  };

  const handleSaveTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.location.trim()) return;

    const objectivesList = formData.objectives
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const defaultChecklist = [
      { item: 'Gearbox full enclosure & pinch-point guard verified', checked: true },
      { item: 'Emergency spindle brake/disengage functional', checked: true },
      { item: 'Zero sharp burrs on chassis edges', checked: true },
      { item: 'Bearing lubrication sealed to prevent cotton contamination', checked: true },
      { item: 'Pre-trial artisan ergonomic orientation conducted', checked: true },
    ];

    addFieldTrial({
      title: formData.title.trim(),
      location: formData.location.trim(),
      clusterOrOrganization: formData.clusterOrOrganization.trim(),
      designId: formData.designId,
      startDate: formData.startDate,
      endDate: formData.endDate ? formData.endDate : undefined,
      participatingArtisansCount: Number(formData.participatingArtisansCount),
      status: formData.status,
      objectives: objectivesList,
      safetyChecklist: defaultChecklist,
      baselineObservations: formData.baselineObservations.trim(),
      artisanFeedbackSummary: formData.artisanFeedbackSummary.trim(),
      maintenanceIssuesLogged: formData.maintenanceIssues
        ? formData.maintenanceIssues.split('\n').filter(Boolean)
        : [],
      followUpActions: formData.followUpActions.trim(),
      responsibleLead: formData.responsibleLead.trim(),
    });

    setIsModalOpen(false);
  };

  const roadmapSteps = [
    {
      step: 1,
      title: 'Prototype Design & Fabrication',
      desc: 'CAD kinematics simulation, planetary gear 1:32 manufacturing and chassis machining.',
      done: true,
    },
    {
      step: 2,
      title: 'Initial Safety & Pinch-Point Inspection',
      desc: 'Verification of gear housing enclosure, finger pinch hazards and burr elimination.',
      done: true,
    },
    {
      step: 3,
      title: 'Controlled Lab Baseline Comparison',
      desc: 'Tachometer calibration, input torque dynamometer testing against standard Ambar Charkha.',
      done: true,
    },
    {
      step: 4,
      title: 'Small Supervised Artisan Trial (3-5 Spinners)',
      desc: 'Participatory testing at Sevagram Ashram with experienced master spinners.',
      done: true,
    },
    {
      step: 5,
      title: 'Measurement & Empirical Feedback Collection',
      desc: 'Logging output grams, breakage frequency, and Borg CR10 perceived exertion.',
      done: true,
    },
    {
      step: 6,
      title: 'Mechanical Design Revision (V1 -> V2)',
      desc: 'Refining crank handle bearing, adding spring tensioners, and lightening frame.',
      done: true,
    },
    {
      step: 7,
      title: 'Expanded Rural Field Evaluation (20+ Spinners)',
      desc: 'Multi-cluster deployment across Saurashtra and Vidarbha Khadi institutions.',
      done: false,
    },
    {
      step: 8,
      title: 'Vendor Development & Tooling Scale-Up',
      desc: 'Collaborating with MSME machining vendors for die-cast batch production at volume.',
      done: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#29312D]">
            Field Trials & Practical Deployment Roadmap
          </h2>
          <p className="text-xs text-[#68736C]">
            Grassroots verification of mechanical stability, artisan acceptance, and safety in rural Khadi clusters
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          Schedule New Trial
        </button>
      </div>

      {/* 8-Step Practical Deployment Roadmap */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
          <div>
            <h3 className="font-serif font-bold text-base text-[#29312D]">
              8-Stage Hardware Deployment & Adoption Plan
            </h3>
            <p className="text-xs text-[#68736C]">
              Step-by-step pathway from lab prototype to MSME cluster adoption
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-[#367A57] bg-[#E3EFE8] px-2.5 py-1 rounded-full">
            Stage 6 Completed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {roadmapSteps.map((s) => (
            <div
              key={s.step}
              className={`p-3.5 rounded-lg border text-xs flex flex-col justify-between ${
                s.done
                  ? 'bg-[#FAF8F2] border-[#78917B]/40'
                  : 'bg-white border-[#E5E0D5] opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#E5E0D5] text-[#243B53]">
                    Step {s.step}
                  </span>
                  {s.done ? (
                    <CheckCircle2 className="w-4 h-4 text-[#367A57]" />
                  ) : (
                    <Clock className="w-4 h-4 text-[#829AB1]" />
                  )}
                </div>
                <h4 className="font-semibold text-[#29312D] text-xs mb-1">{s.title}</h4>
                <p className="text-[11px] text-[#68736C] leading-snug">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Field Trials List & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Trials List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#68736C] px-1 font-semibold">
            <span>Cluster Field Trials ({state.fieldTrials.length})</span>
            <span>Status</span>
          </div>

          {state.fieldTrials.map((trial) => {
            const isSelected = selectedTrial?.id === trial.id;
            return (
              <div
                key={trial.id}
                onClick={() => setSelectedTrial(trial)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-white border-[#243B53] shadow-md ring-1 ring-[#243B53]'
                    : 'bg-white border-[#E5E0D5] hover:bg-[#FAF8F2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-[#829AB1]">
                    {trial.startDate}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded capitalize ${
                      trial.status === 'completed'
                        ? 'bg-[#E3EFE8] text-[#367A57]'
                        : trial.status === 'in-progress'
                        ? 'bg-[#FEF6E7] text-[#B7791F]'
                        : 'bg-[#FAF8F2] text-[#68736C]'
                    }`}
                  >
                    {trial.status.replace('-', ' ')}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm text-[#29312D] mb-1">
                  {trial.title}
                </h4>
                <p className="text-xs text-[#68736C] truncate">{trial.location}</p>
                <div className="mt-2 pt-2 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] text-[#68736C]">
                  <span>{trial.participatingArtisansCount} Artisans</span>
                  <span className="text-[#243B53] font-medium">View dossier →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Trial Dossier */}
        <div className="lg:col-span-2">
          {selectedTrial ? (
            <div className="bg-white rounded-xl border border-[#E5E0D5] p-6 shadow-2xs space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F0EBE1] pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#FAF8F2] text-[#243B53] font-bold">
                      {selectedTrial.clusterOrOrganization}
                    </span>
                    <span className="text-xs text-[#68736C]">· {selectedTrial.location}</span>
                  </div>
                  <h3 className="font-serif font-bold text-lg text-[#29312D]">
                    {selectedTrial.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteFieldTrial(selectedTrial.id)}
                    className="p-1.5 text-[#68736C] hover:text-[#B94040] rounded transition-colors"
                    title="Delete trial dossier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Quick Specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 bg-[#FAF8F2] rounded-lg">
                  <span className="text-[10px] text-[#68736C] uppercase block">Start Date</span>
                  <span className="font-mono font-bold text-[#29312D]">
                    {selectedTrial.startDate}
                  </span>
                </div>
                <div className="p-2.5 bg-[#FAF8F2] rounded-lg">
                  <span className="text-[10px] text-[#68736C] uppercase block">Artisans</span>
                  <span className="font-mono font-bold text-[#29312D]">
                    {selectedTrial.participatingArtisansCount} Spinners
                  </span>
                </div>
                <div className="p-2.5 bg-[#FAF8F2] rounded-lg">
                  <span className="text-[10px] text-[#68736C] uppercase block">Chassis Tested</span>
                  <span className="font-mono font-bold text-[#243B53]">SutraSetu V1</span>
                </div>
                <div className="p-2.5 bg-[#FAF8F2] rounded-lg">
                  <span className="text-[10px] text-[#68736C] uppercase block">Lead Engineer</span>
                  <span className="font-bold text-[#29312D] truncate block">
                    {selectedTrial.responsibleLead}
                  </span>
                </div>
              </div>

              {/* Objectives */}
              <div>
                <h4 className="font-semibold text-xs uppercase tracking-wider text-[#68736C] mb-2">
                  Trial Objectives
                </h4>
                <ul className="space-y-1.5 text-xs text-[#29312D]">
                  {selectedTrial.objectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <ChevronRight className="w-3.5 h-3.5 text-[#B65D3A] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Safety & Training Checklist */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-[#68736C]">
                    Mandatory Safety & Ergonomic Orientation Checklist
                  </h4>
                  <span className="text-[11px] text-[#78917B] font-mono">
                    Interactive Field Protocol
                  </span>
                </div>
                <div className="space-y-2 bg-[#FAF8F2] p-3.5 rounded-lg border border-[#E5E0D5]">
                  {selectedTrial.safetyChecklist.map((item, idx) => (
                    <label
                      key={idx}
                      className="flex items-center gap-2.5 text-xs text-[#29312D] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => toggleTrialChecklist(selectedTrial.id, idx)}
                        className="rounded border-[#E5E0D5] text-[#243B53] focus:ring-0 w-4 h-4 cursor-pointer"
                      />
                      <span className={item.checked ? 'text-[#29312D]' : 'text-[#68736C]'}>
                        {item.item}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Baseline vs Artisan Feedback */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-white border border-[#E5E0D5] rounded-lg space-y-1">
                  <span className="font-semibold text-[#243B53] block">
                    Baseline Observations:
                  </span>
                  <p className="text-[#68736C] leading-relaxed">
                    {selectedTrial.baselineObservations}
                  </p>
                </div>

                <div className="p-3.5 bg-white border border-[#E5E0D5] rounded-lg space-y-1">
                  <span className="font-semibold text-[#367A57] block">
                    Artisan Feedback & Acceptance:
                  </span>
                  <p className="text-[#68736C] leading-relaxed">
                    {selectedTrial.artisanFeedbackSummary || 'Feedback recording in progress.'}
                  </p>
                </div>
              </div>

              {/* Maintenance & Follow-Up */}
              <div className="text-xs space-y-2 pt-2 border-t border-[#F0EBE1]">
                <div>
                  <strong className="text-[#68736C]">Maintenance Issues Logged:</strong>
                  {selectedTrial.maintenanceIssuesLogged.length === 0 ? (
                    <span className="text-[#367A57] ml-2">No structural issues recorded.</span>
                  ) : (
                    <ul className="list-disc list-inside mt-1 space-y-0.5 text-[#29312D]">
                      {selectedTrial.maintenanceIssuesLogged.map((iss, i) => (
                        <li key={i}>{iss}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <strong className="text-[#68736C]">Follow-Up Action Plan:</strong>
                  <span className="text-[#29312D] ml-2">{selectedTrial.followUpActions}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-[#68736C] bg-white rounded-xl border border-[#E5E0D5]">
              Select a field trial from the left to view the complete testing dossier.
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E0D5] w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden">
            <div className="px-6 py-4 bg-[#243B53] text-[#F7F3E8] flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-white">
                Register New Field Trial Dossier
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#BAC7D5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTrial} className="p-6 overflow-y-auto flex-1 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Trial Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Cluster / Org *</label>
                  <input
                    type="text"
                    required
                    value={formData.clusterOrOrganization}
                    onChange={(e) =>
                      setFormData({ ...formData, clusterOrOrganization: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Location (State/District) *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Artisans Count</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.participatingArtisansCount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        participatingArtisansCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as FieldTrialStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Objectives (one per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Baseline Observations
                </label>
                <textarea
                  rows={2}
                  value={formData.baselineObservations}
                  onChange={(e) =>
                    setFormData({ ...formData, baselineObservations: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Responsible Lead</label>
                <input
                  type="text"
                  value={formData.responsibleLead}
                  onChange={(e) => setFormData({ ...formData, responsibleLead: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 border-t border-[#E5E0D5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E0D5] rounded-lg text-[#68736C]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B65D3A] text-white font-bold rounded-lg shadow-2xs"
                >
                  Create Trial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
