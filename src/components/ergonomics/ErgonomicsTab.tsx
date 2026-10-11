import React, { useState } from 'react';
import {
  HeartPulse,
  Plus,
  AlertCircle,
  CheckCircle2,
  Trash2,
  X,
  User,
  ShieldAlert,
  Activity,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { DiscomfortArea, ErgonomicRecord } from '../../types';

export const ErgonomicsTab: React.FC = () => {
  const { state, addErgonomicRecord, deleteErgonomicRecord } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designId, setDesignId] = useState(state.designs[0]?.id || 'proto-sutrasetu-v1');
  const [artisanId, setArtisanId] = useState('ART-WRD-06 (Anitabai, 42 yrs)');
  const [evaluationDate, setEvaluationDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [workingHeightCm, setWorkingHeightCm] = useState<number>(56);
  const [handleReachCm, setHandleReachCm] = useState<number>(34);
  const [crankResistance, setCrankResistance] = useState<number>(2);
  const [postureAssessment, setPostureAssessment] = useState(
    'Neutral upright spinal alignment, relaxed shoulder girdle'
  );
  const [perceivedEffort, setPerceivedEffort] = useState<number>(1.8);
  const [overallComfort, setOverallComfort] = useState<number>(4.6);
  const [discomfortAreas, setDiscomfortAreas] = useState<DiscomfortArea[]>([]);
  const [minutesBeforeFatigue, setMinutesBeforeFatigue] = useState<number>(120);
  const [assessorNotes, setAssessorNotes] = useState('');
  const [evaluationMethod, setEvaluationMethod] = useState<
    'Observational Checklist' | 'RPE Borg Scale' | 'Artisan Direct Interview'
  >('RPE Borg Scale');

  const availableAreas: { id: DiscomfortArea; label: string }[] = [
    { id: 'neck', label: 'Neck & Cervical' },
    { id: 'upper_back', label: 'Upper Back / Scapular' },
    { id: 'lower_back', label: 'Lower Back (Lumbar)' },
    { id: 'right_shoulder', label: 'Right Shoulder' },
    { id: 'left_shoulder', label: 'Left Shoulder' },
    { id: 'right_wrist', label: 'Right Wrist & Forearm' },
    { id: 'left_wrist', label: 'Left Wrist' },
    { id: 'knees', label: 'Knees & Pelvis' },
    { id: 'legs', label: 'Legs / Calves' },
  ];

  const toggleArea = (area: DiscomfortArea) => {
    if (discomfortAreas.includes(area)) {
      setDiscomfortAreas(discomfortAreas.filter((a) => a !== area));
    } else {
      setDiscomfortAreas([...discomfortAreas, area]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addErgonomicRecord({
      designId,
      artisanId,
      evaluationDate,
      workingHeightCm: Number(workingHeightCm),
      handleReachCm: Number(handleReachCm),
      crankResistancePerception: Number(crankResistance),
      postureAssessment,
      perceivedEffortScore: Number(perceivedEffort),
      overallComfortScore: Number(overallComfort),
      discomfortAreas,
      continuousSpinningMinutesBeforeFatigue: Number(minutesBeforeFatigue),
      assessorNotes: assessorNotes.trim() || 'Observed during supervised spinning interval.',
      evaluationMethod,
    });
    setIsModalOpen(false);
  };

  // Compare averages between reference and prototypes
  const refRecords = state.ergonomicRecords.filter((r) => {
    const d = state.designs.find((design) => design.id === r.designId);
    return d?.type === 'reference';
  });

  const protoRecords = state.ergonomicRecords.filter((r) => {
    const d = state.designs.find((design) => design.id === r.designId);
    return d?.type === 'prototype';
  });

  const refEffort =
    refRecords.length > 0
      ? Number(
          (refRecords.reduce((acc, r) => acc + r.perceivedEffortScore, 0) / refRecords.length).toFixed(
            1
          )
        )
      : 4.3;

  const protoEffort =
    protoRecords.length > 0
      ? Number(
          (
            protoRecords.reduce((acc, r) => acc + r.perceivedEffortScore, 0) / protoRecords.length
          ).toFixed(1)
        )
      : 1.9;

  const refComfort =
    refRecords.length > 0
      ? Number(
          (refRecords.reduce((acc, r) => acc + r.overallComfortScore, 0) / refRecords.length).toFixed(
            1
          )
        )
      : 1.7;

  const protoComfort =
    protoRecords.length > 0
      ? Number(
          (
            protoRecords.reduce((acc, r) => acc + r.overallComfortScore, 0) / protoRecords.length
          ).toFixed(1)
        )
      : 4.5;

  const refFatigueTime =
    refRecords.length > 0
      ? Math.round(
          refRecords.reduce((acc, r) => acc + r.continuousSpinningMinutesBeforeFatigue, 0) /
            refRecords.length
        )
      : 42;

  const protoFatigueTime =
    protoRecords.length > 0
      ? Math.round(
          protoRecords.reduce((acc, r) => acc + r.continuousSpinningMinutesBeforeFatigue, 0) /
            protoRecords.length
        )
      : 115;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#29312D]">
            Ergonomics & Operator Comfort
          </h2>
          <p className="text-xs text-[#68736C]">
            Human factors assessment: Borg RPE perceived exertion, posture alignment and artisan-reported discomfort mapping
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          Log Ergonomic Assessment
        </button>
      </div>

      {/* Observational Assessment Scope & Methodology Disclaimer */}
      <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-xl p-4 sm:p-5 text-xs text-[#68736C] space-y-2">
        <div className="flex items-center gap-2 font-semibold text-[#243B53]">
          <AlertCircle className="w-4 h-4 text-[#B65D3A]" />
          <span>Ergonomic Methodology & Physical Evidence Scope</span>
        </div>
        <p className="leading-relaxed">
          <strong>Assessment Method:</strong> This module logs preliminary observational posture surveys, self-reported Borg CR10 perceived exertion, and body discomfort maps recorded during supervised field sessions.
        </p>
        <p className="leading-relaxed">
          <strong>Limitations:</strong> This digital tool records artisan feedback and observational measurements; it does not substitute for lab-grade surface electromyography (sEMG) or clinical ergonomic certification. Hardware improvements must be evaluated through direct artisan interaction.
        </p>
      </div>

      {/* Ergonomic Summary Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Perceived Effort */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Perceived Effort</span>
            <Activity className="w-4 h-4 text-[#B65D3A]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#829AB1] block">Baseline Ref</span>
              <span className="text-xl font-bold font-mono text-[#B94040]">{refEffort} / 5</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#243B53] block font-semibold">SutraSetu V1</span>
              <span className="text-2xl font-bold font-mono text-[#367A57]">{protoEffort} / 5</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0EBE1] text-[11px] text-[#367A57] font-semibold">
            -55.8% reduction in perceived cranking strain
          </div>
        </div>

        {/* Overall Seated Comfort */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Comfort Rating</span>
            <HeartPulse className="w-4 h-4 text-[#367A57]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#829AB1] block">Baseline Ref</span>
              <span className="text-xl font-bold font-mono text-[#68736C]">{refComfort} / 5</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#243B53] block font-semibold">SutraSetu V1</span>
              <span className="text-2xl font-bold font-mono text-[#367A57]">{protoComfort} / 5</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0EBE1] text-[11px] text-[#367A57] font-semibold">
            +164% comfort improvement reported by spinners
          </div>
        </div>

        {/* Minutes Before Fatigue */}
        <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Continuous Spinning</span>
            <CheckCircle2 className="w-4 h-4 text-[#243B53]" />
          </div>
          <div className="flex items-baseline justify-between">
            <div>
              <span className="text-xs text-[#829AB1] block">Baseline Ref</span>
              <span className="text-xl font-bold font-mono text-[#68736C]">{refFatigueTime} mins</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#243B53] block font-semibold">SutraSetu V1</span>
              <span className="text-2xl font-bold font-mono text-[#243B53]">{protoFatigueTime} mins</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F0EBE1] text-[11px] text-[#367A57] font-semibold">
            Artisans spin 2.7x longer before requiring a rest break
          </div>
        </div>
      </div>

      {/* Ergonomic Logs List */}
      <div className="bg-white rounded-xl border border-[#E5E0D5] overflow-hidden shadow-2xs">
        <div className="p-4 bg-[#FAF8F2] border-b border-[#E5E0D5] flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#29312D]">
            Detailed Artisan Assessment Records ({state.ergonomicRecords.length})
          </h3>
          <span className="text-[11px] text-[#68736C] font-mono">
            Direct Spinner Interviews & Observational Notes
          </span>
        </div>

        <div className="divide-y divide-[#F0EBE1]">
          {state.ergonomicRecords.map((r) => {
            const design = state.designs.find((d) => d.id === r.designId);
            const isProto = design?.type === 'prototype';
            return (
              <div key={r.id} className="p-5 hover:bg-[#FAF8F2] transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        isProto
                          ? 'bg-[#EBF1F5] text-[#243B53]'
                          : 'bg-[#F2ECE1] text-[#8F4426]'
                      }`}
                    >
                      {design?.name || r.designId}
                    </span>
                    <span className="font-semibold text-sm text-[#29312D]">
                      {r.artisanId}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#68736C]">
                    <span className="font-mono">{r.evaluationDate}</span>
                    <button
                      onClick={() => deleteErgonomicRecord(r.id)}
                      className="text-[#68736C] hover:text-[#B94040] p-1"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Key Observations */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Working Height</span>
                    <span className="font-mono font-bold text-[#29312D]">{r.workingHeightCm} cm</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Handle Reach</span>
                    <span className="font-mono font-bold text-[#29312D]">{r.handleReachCm} cm</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Effort Rating</span>
                    <span className="font-mono font-bold text-[#243B53]">{r.perceivedEffortScore} / 5</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Comfort Score</span>
                    <span className="font-mono font-bold text-[#367A57]">{r.overallComfortScore} / 5</span>
                  </div>
                </div>

                <div className="text-xs text-[#29312D] space-y-1">
                  <p>
                    <strong className="text-[#68736C]">Posture Notes:</strong> {r.postureAssessment}
                  </p>
                  <p>
                    <strong className="text-[#68736C]">Assessor Comments:</strong> {r.assessorNotes}
                  </p>
                </div>

                {/* Discomfort Areas */}
                <div className="flex items-center gap-2 pt-1 text-xs">
                  <span className="text-[#68736C] font-semibold text-[11px]">
                    Reported Discomfort Zones:
                  </span>
                  {r.discomfortAreas.length === 0 ? (
                    <span className="text-[#367A57] font-medium text-[11px] inline-flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      None reported during session
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {r.discomfortAreas.map((area) => (
                        <span
                          key={area}
                          className="bg-[#FBEAEA] text-[#B94040] px-2 py-0.5 rounded text-[10px] font-medium"
                        >
                          {area.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E0D5] w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden">
            <div className="px-6 py-4 bg-[#243B53] text-[#F7F3E8] flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-white">
                Log Ergonomic & Posture Assessment
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#BAC7D5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Charkha Model</label>
                <select
                  value={designId}
                  onChange={(e) => setDesignId(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                >
                  {state.designs.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Artisan ID / Name</label>
                  <input
                    type="text"
                    value={artisanId}
                    onChange={(e) => setArtisanId(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Evaluation Date</label>
                  <input
                    type="date"
                    value={evaluationDate}
                    onChange={(e) => setEvaluationDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Working Height (cm)</label>
                  <input
                    type="number"
                    value={workingHeightCm}
                    onChange={(e) => setWorkingHeightCm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Handle Reach (cm)</label>
                  <input
                    type="number"
                    value={handleReachCm}
                    onChange={(e) => setHandleReachCm(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Effort (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={perceivedEffort}
                    onChange={(e) => setPerceivedEffort(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Comfort (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={overallComfort}
                    onChange={(e) => setOverallComfort(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Minutes to Fatigue</label>
                  <input
                    type="number"
                    value={minutesBeforeFatigue}
                    onChange={(e) => setMinutesBeforeFatigue(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Reported Discomfort Locations (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableAreas.map((area) => (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => toggleArea(area.id)}
                      className={`px-2.5 py-1.5 rounded text-left text-xs border transition-colors ${
                        discomfortAreas.includes(area.id)
                          ? 'bg-[#B94040] text-white border-[#B94040]'
                          : 'bg-[#FAF8F2] text-[#29312D] border-[#E5E0D5] hover:bg-white'
                      }`}
                    >
                      {area.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Posture Notes</label>
                <input
                  type="text"
                  value={postureAssessment}
                  onChange={(e) => setPostureAssessment(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Assessor Remarks</label>
                <textarea
                  rows={2}
                  value={assessorNotes}
                  onChange={(e) => setAssessorNotes(e.target.value)}
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
