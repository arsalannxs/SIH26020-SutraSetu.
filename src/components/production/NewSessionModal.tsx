import React, { useState } from 'react';
import { X, Check, Activity, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateProductionRate } from '../../utils/calculations';

export const NewSessionModal: React.FC = () => {
  const { state, isNewSessionModalOpen, setIsNewSessionModalOpen, addSession } = useApp();

  const [designId, setDesignId] = useState<string>(
    state.designs[0]?.id || 'proto-sutrasetu-v1'
  );
  const [artisanId, setArtisanId] = useState<string>('ART-WRD-05');
  const [artisanName, setArtisanName] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [durationMinutes, setDurationMinutes] = useState<number>(120);
  const [yarnGrams, setYarnGrams] = useState<number>(150);
  const [breakCount, setBreakCount] = useState<number>(2);
  const [effortRating, setEffortRating] = useState<number>(2);
  const [comfortRating, setComfortRating] = useState<number>(4);
  const [cottonType, setCottonType] = useState<string>('Desi Organic Cotton 30s Sliver');
  const [consistencyNotes, setConsistencyNotes] = useState<string>('');
  const [environmentNotes, setEnvironmentNotes] = useState<string>('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isNewSessionModalOpen) return null;

  const currentRate = calculateProductionRate(yarnGrams, durationMinutes);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!designId) newErrors.designId = 'Please select a Charkha design.';
    if (!artisanId.trim()) newErrors.artisanId = 'Operator/Artisan ID is required.';
    if (!durationMinutes || durationMinutes <= 0) {
      newErrors.duration = 'Session duration must be greater than zero.';
    }
    if (!yarnGrams || yarnGrams <= 0) {
      newErrors.yarnGrams = 'Yarn produced must be greater than zero.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addSession({
      designId,
      artisanOrOperatorId: artisanId.trim(),
      artisanName: artisanName.trim() || undefined,
      date,
      durationMinutes: Number(durationMinutes),
      yarnProducedGrams: Number(yarnGrams),
      breakCount: Number(breakCount) || 0,
      effortRating: Number(effortRating),
      comfortRating: Number(comfortRating),
      cottonType: cottonType.trim() || 'Standard Sliver',
      consistencyNotes: consistencyNotes.trim() || 'Standard observation recorded during test.',
      environmentNotes: environmentNotes.trim() || undefined,
    });

    setIsNewSessionModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-[#E5E0D5] w-full max-w-xl max-h-[92vh] flex flex-col my-auto overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-[#243B53] text-[#F7F3E8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#B65D3A]" />
            <h2 className="text-lg font-serif font-bold text-white">Record Spinning Session</h2>
          </div>
          <button
            onClick={() => setIsNewSessionModalOpen(false)}
            className="text-[#BAC7D5] hover:text-white p-1 rounded-md transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-sm text-[#29312D]">
          {/* Design Selection */}
          <div>
            <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
              Charkha Equipment Model *
            </label>
            <select
              value={designId}
              onChange={(e) => setDesignId(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg bg-[#FAF8F2] text-[#29312D] focus:ring-2 focus:ring-[#243B53] focus:outline-none"
            >
              {state.designs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.type === 'reference' ? 'Baseline Reference' : 'Prototype'})
                </option>
              ))}
            </select>
            {errors.designId && <p className="text-xs text-[#B94040] mt-1">{errors.designId}</p>}
          </div>

          {/* Operator Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Artisan / Operator ID *
              </label>
              <input
                type="text"
                placeholder="e.g. ART-WRD-05 or Anonymous #1"
                value={artisanId}
                onChange={(e) => setArtisanId(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
              {errors.artisanId && <p className="text-xs text-[#B94040] mt-1">{errors.artisanId}</p>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Artisan Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Rekhadidi"
                value={artisanName}
                onChange={(e) => setArtisanName(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
            </div>
          </div>

          {/* Date, Duration & Yarn Weight */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Duration (Minutes) *
              </label>
              <input
                type="number"
                min="1"
                max="720"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
              {errors.duration && <p className="text-xs text-[#B94040] mt-1">{errors.duration}</p>}
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Yarn Output (Grams) *
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={yarnGrams}
                onChange={(e) => setYarnGrams(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
              {errors.yarnGrams && <p className="text-xs text-[#B94040] mt-1">{errors.yarnGrams}</p>}
            </div>
          </div>

          {/* Live Calculated Metric Pill Banner */}
          <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-lg p-3 flex items-center justify-between">
            <div className="text-xs text-[#68736C]">
              Calculated Hourly Productivity Rate:
              <span className="block text-[11px] text-[#78917B]">
                Formula: {yarnGrams || 0}g ÷ {((durationMinutes || 1) / 60).toFixed(2)}h
              </span>
            </div>
            <div className="text-right">
              <span className="text-lg font-mono font-bold text-[#243B53]">
                {currentRate} <span className="text-xs font-normal text-[#68736C]">g/hr</span>
              </span>
            </div>
          </div>

          {/* Cotton Type & Breaks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Cotton Sliver Type / Count
              </label>
              <input
                type="text"
                placeholder="e.g. Desi 28s, Organic Sujata 34s"
                value={cottonType}
                onChange={(e) => setCottonType(e.target.value)}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Yarn Breaks Count
              </label>
              <input
                type="number"
                min="0"
                value={breakCount}
                onChange={(e) => setBreakCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none"
              />
            </div>
          </div>

          {/* Effort & Comfort Ratings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Operator Perceived Effort (1-5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setEffortRating(lvl)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-all border ${
                      effortRating === lvl
                        ? 'bg-[#243B53] text-white border-[#243B53]'
                        : 'bg-white text-[#29312D] border-[#E5E0D5] hover:bg-[#F7F3E8]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#68736C] block mt-1">
                {effortRating === 1 && '1 = Very Light (Effortless)'}
                {effortRating === 2 && '2 = Light (Minimal strain)'}
                {effortRating === 3 && '3 = Moderate (Sustainable effort)'}
                {effortRating === 4 && '4 = Heavy (Shoulder/wrist strain)'}
                {effortRating === 5 && '5 = Severe Exhaustion'}
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
                Comfort Rating (1-5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setComfortRating(lvl)}
                    className={`flex-1 py-1.5 rounded text-xs font-bold transition-all border ${
                      comfortRating === lvl
                        ? 'bg-[#78917B] text-white border-[#78917B]'
                        : 'bg-white text-[#29312D] border-[#E5E0D5] hover:bg-[#F7F3E8]'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-[#68736C] block mt-1">
                {comfortRating === 1 && '1 = Highly Uncomfortable'}
                {comfortRating === 2 && '2 = Mildly Strained'}
                {comfortRating === 3 && '3 = Acceptable / Neutral'}
                {comfortRating === 4 && '4 = Comfortable'}
                {comfortRating === 5 && '5 = Ergonomically Excellent'}
              </span>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block font-semibold mb-1 text-xs uppercase tracking-wider text-[#68736C]">
              Yarn Consistency & Mechanical Observations
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Smooth spindle rotation, no belt slip, even drafting noticed..."
              value={consistencyNotes}
              onChange={(e) => setConsistencyNotes(e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg focus:ring-2 focus:ring-[#243B53] focus:outline-none text-xs"
            />
          </div>

          <div className="text-[11px] text-[#68736C] flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-[#B65D3A] shrink-0" />
            <span>
              Recorded values are empirical trial logs and do not imply automated textile sensor certification.
            </span>
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#E5E0D5] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsNewSessionModalOpen(false)}
              className="px-4 py-2 border border-[#E5E0D5] rounded-lg text-xs font-medium text-[#68736C] hover:bg-[#F7F3E8]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <Check className="w-4 h-4" />
              Save Session Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
