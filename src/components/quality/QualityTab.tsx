import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Scale,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Download,
  Trash2,
  X,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { YarnQualityRecord } from '../../types';
import { calculateNeCount } from '../../utils/calculations';
import { downloadCsv } from '../../utils/csvExport';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

export const QualityTab: React.FC = () => {
  const { state, addQualityRecord, deleteQualityRecord } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [designId, setDesignId] = useState(state.designs[0]?.id || 'proto-sutrasetu-v1');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [assessorName, setAssessorName] = useState('Ananya Verma (Mechanical Testing Lead)');
  const [sampleLengthMeters, setSampleLengthMeters] = useState<number>(120);
  const [sampleMassGrams, setSampleMassGrams] = useState<number>(2.3);
  const [twistPerInchTpi, setTwistPerInchTpi] = useState<number>(26);
  const [evennessRating, setEvennessRating] = useState<number>(4.5);
  const [breaksPerHundredGrams, setBreaksPerHundredGrams] = useState<number>(1.8);
  const [defectsInput, setDefectsInput] = useState('Minimal neps, uniform drafting');
  const [measurementMethod, setMeasurementMethod] = useState(
    'Wrap Reel + 0.01g Analytical Balance + Zweigle Twist Counter'
  );
  const [assessorComments, setAssessorComments] = useState('');
  const [isInstrumentMeasured, setIsInstrumentMeasured] = useState(true);

  const calculatedNe = calculateNeCount(sampleLengthMeters, sampleMassGrams);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const defects = defectsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    addQualityRecord({
      designId,
      testDate,
      assessorName,
      sampleLengthMeters: Number(sampleLengthMeters),
      sampleMassGrams: Number(sampleMassGrams),
      measuredNeCount: calculatedNe || 30.0,
      twistPerInchTpi: Number(twistPerInchTpi),
      evennessRating: Number(evennessRating),
      breaksPerHundredGrams: Number(breaksPerHundredGrams),
      defectObservations: defects,
      measurementMethod,
      assessorComments: assessorComments.trim() || 'Laboratory assessment record logged.',
      isInstrumentMeasured,
    });

    setIsModalOpen(false);
  };

  // Aggregated comparison data for chart
  const chartData = state.designs.map((d) => {
    const records = state.qualityRecords.filter((q) => q.designId === d.id);
    const avgNe =
      records.length > 0
        ? Number(
            (records.reduce((acc, r) => acc + r.measuredNeCount, 0) / records.length).toFixed(1)
          )
        : 0;
    const avgTpi =
      records.length > 0
        ? Number(
            (records.reduce((acc, r) => acc + r.twistPerInchTpi, 0) / records.length).toFixed(1)
          )
        : 0;
    const avgEvenness =
      records.length > 0
        ? Number(
            (records.reduce((acc, r) => acc + r.evennessRating, 0) / records.length).toFixed(1)
          )
        : 0;
    const avgBreaks =
      records.length > 0
        ? Number(
            (
              records.reduce((acc, r) => acc + r.breaksPerHundredGrams, 0) / records.length
            ).toFixed(1)
          )
        : 0;

    return {
      name: d.type === 'reference' ? 'Ambar (Ref)' : d.name.slice(0, 16),
      NeCount: avgNe,
      TwistTPI: avgTpi,
      Evenness: avgEvenness * 10,
      BreaksPer100g: avgBreaks * 5,
    };
  });

  const handleExportCsv = () => {
    const headers = [
      'Test ID',
      'Date',
      'Charkha Model',
      'Assessor',
      'Sample Length (m)',
      'Sample Mass (g)',
      'Calculated Ne Count',
      'Twist (TPI)',
      'Evenness (1-5)',
      'Breaks / 100g',
      'Defects Observed',
      'Measurement Tool / Method',
      'Instrument Measured?',
      'Comments',
    ];

    const rows = state.qualityRecords.map((r) => {
      const design = state.designs.find((d) => d.id === r.designId);
      return [
        r.id,
        r.testDate,
        design?.name || r.designId,
        r.assessorName,
        r.sampleLengthMeters,
        r.sampleMassGrams,
        r.measuredNeCount,
        r.twistPerInchTpi,
        r.evennessRating,
        r.breaksPerHundredGrams,
        r.defectObservations.join('; '),
        r.measurementMethod,
        r.isInstrumentMeasured ? 'Instrumented' : 'Subjective',
        r.assessorComments,
      ];
    });

    downloadCsv(`sutrasetu_yarn_quality_records_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#29312D]">
            Yarn Quality Evaluation
          </h2>
          <p className="text-xs text-[#68736C]">
            Textile physics measurements: English Cotton Count (Ne), Twist per inch (TPI), evenness, and defect frequency
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 bg-white border border-[#E5E0D5] hover:bg-[#FAF8F2] text-[#243B53] text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#B65D3A]" />
            Export Quality CSV
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Test Record
          </button>
        </div>
      </div>

      {/* Transparent Formula & Methodology Card */}
      <div className="bg-[#FAF8F2] border border-[#E5E0D5] rounded-xl p-4 sm:p-5">
        <div className="flex items-center gap-2 font-serif font-bold text-[#243B53] text-sm mb-2">
          <Scale className="w-4 h-4 text-[#B65D3A]" />
          <span>Standard Textile Formulas & Units</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#29312D]">
          <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
            <strong className="text-[#243B53] block mb-1">
              English Cotton Count (Ne):
            </strong>
            <p className="font-mono text-[#B65D3A] text-xs mb-1">
              Ne = Sample Length (m) ÷ (Sample Mass (g) × 1.6933)
            </p>
            <p className="text-[11px] text-[#68736C]">
              1 Ne corresponds to 840 yards per pound. Finer yarns possess a higher count number (e.g. 40s is finer than 20s).
            </p>
          </div>

          <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
            <strong className="text-[#243B53] block mb-1">
              Twist Per Inch (TPI) & Evenness:
            </strong>
            <p className="font-mono text-[#B65D3A] text-xs mb-1">
              TPI = Measured Twists per 1-inch gage length (Z-twist)
            </p>
            <p className="text-[11px] text-[#68736C]">
              Separates instrumented balance/twist counter data from visual sensory ratings (evenness rating 1-5).
            </p>
          </div>
        </div>
      </div>

      {/* Quality Comparison Chart */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E0D5] shadow-2xs">
        <h3 className="text-base font-serif font-bold text-[#29312D] mb-1">
          Yarn Consistency Comparison Across Models
        </h3>
        <p className="text-xs text-[#68736C] mb-4">
          Comparing measured English Cotton Count (Ne), Twist (TPI), and Evenness Index
        </p>

        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" />
              <XAxis dataKey="name" stroke="#829AB1" fontSize={11} />
              <YAxis stroke="#829AB1" fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
              <Bar dataKey="NeCount" fill="#243B53" name="Ne Count" radius={[4, 4, 0, 0]} />
              <Bar dataKey="TwistTPI" fill="#B65D3A" name="Twist (TPI)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Evenness" fill="#78917B" name="Evenness (Scaled x10)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quality Records Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D5] overflow-hidden shadow-2xs">
        <div className="p-4 bg-[#FAF8F2] border-b border-[#E5E0D5] flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#29312D]">
            Laboratory Test Logs ({state.qualityRecords.length})
          </h3>
          <span className="text-[11px] text-[#68736C] font-mono">
            Analytical Balance & Twist Tester Data
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#E5E0D5] text-[#68736C] uppercase font-mono text-[10px] bg-[#FAF8F2]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Charkha Model</th>
                <th className="py-2.5 px-3">Assessor</th>
                <th className="py-2.5 px-3 text-right">Sample</th>
                <th className="py-2.5 px-3 text-right">Ne Count</th>
                <th className="py-2.5 px-3 text-right">Twist (TPI)</th>
                <th className="py-2.5 px-3 text-center">Evenness</th>
                <th className="py-2.5 px-3 text-center">Breaks/100g</th>
                <th className="py-2.5 px-3">Observations</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {state.qualityRecords.map((r) => {
                const design = state.designs.find((d) => d.id === r.designId);
                return (
                  <tr key={r.id} className="hover:bg-[#FAF8F2] transition-colors">
                    <td className="py-2.5 px-3 font-mono text-[#68736C]">{r.testDate}</td>
                    <td className="py-2.5 px-3 font-medium text-[#29312D]">
                      {design?.name || r.designId}
                    </td>
                    <td className="py-2.5 px-3 text-[#68736C]">{r.assessorName}</td>
                    <td className="py-2.5 px-3 text-right font-mono">
                      {r.sampleLengthMeters}m / {r.sampleMassGrams}g
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#243B53]">
                      {r.measuredNeCount}s Ne
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-[#B65D3A]">
                      {r.twistPerInchTpi} TPI
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          r.evennessRating >= 4
                            ? 'bg-[#E3EFE8] text-[#367A57]'
                            : 'bg-[#FEF6E7] text-[#B7791F]'
                        }`}
                      >
                        {r.evennessRating} / 5
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-medium">
                      {r.breaksPerHundredGrams}
                    </td>
                    <td className="py-2.5 px-3 text-[#68736C] max-w-xs truncate" title={r.assessorComments}>
                      {r.defectObservations.join(', ')} — {r.assessorComments}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => deleteQualityRecord(r.id)}
                        className="p-1 text-[#68736C] hover:text-[#B94040] rounded transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Quality Record Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E0D5] w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden">
            <div className="px-6 py-4 bg-[#243B53] text-[#F7F3E8] flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-white">
                Log Yarn Laboratory Test Record
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
                  <label className="block font-semibold mb-1 text-[#68736C]">Testing Date</label>
                  <input
                    type="date"
                    value={testDate}
                    onChange={(e) => setTestDate(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Assessor Name</label>
                  <input
                    type="text"
                    value={assessorName}
                    onChange={(e) => setAssessorName(e.target.value)}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Sample Length (Meters)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={sampleLengthMeters}
                    onChange={(e) => setSampleLengthMeters(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Sample Mass (Grams)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={sampleMassGrams}
                    onChange={(e) => setSampleMassGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              {/* Calculated Ne preview */}
              <div className="p-2.5 bg-[#FAF8F2] rounded-lg border border-[#E5E0D5] flex items-center justify-between">
                <span className="text-[#68736C]">Calculated Cotton Count:</span>
                <span className="font-mono font-bold text-sm text-[#243B53]">
                  {calculatedNe} Ne
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Twist (TPI)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={twistPerInchTpi}
                    onChange={(e) => setTwistPerInchTpi(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Evenness (1-5)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={evennessRating}
                    onChange={(e) => setEvennessRating(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Breaks/100g</label>
                  <input
                    type="number"
                    step="0.1"
                    value={breaksPerHundredGrams}
                    onChange={(e) => setBreaksPerHundredGrams(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Measurement Method & Instruments
                </label>
                <input
                  type="text"
                  value={measurementMethod}
                  onChange={(e) => setMeasurementMethod(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Defect Observations (comma-separated)
                </label>
                <input
                  type="text"
                  value={defectsInput}
                  onChange={(e) => setDefectsInput(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  placeholder="e.g. Minor neps, occasional slub"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Comments</label>
                <textarea
                  rows={2}
                  value={assessorComments}
                  onChange={(e) => setAssessorComments(e.target.value)}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  placeholder="Assessor remarks on twist consistency and yarn hairiness..."
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
