import React, { useState } from 'react';
import {
  GitCompare,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Printer,
  Download,
  AlertCircle,
  CheckCircle2,
  Scale,
  Clock,
  HeartPulse,
  Coins,
  Cpu,
  Layers,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProductionRate,
  calculatePercentageChange,
  formatInr,
} from '../../utils/calculations';
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

export const ComparisonTab: React.FC = () => {
  const { state } = useApp();

  const referenceDesigns = state.designs.filter((d) => d.type === 'reference');
  const prototypeDesigns = state.designs.filter((d) => d.type === 'prototype');

  const [selectedRefId, setSelectedRefId] = useState<string>(
    referenceDesigns[0]?.id || 'ref-amber-8spindle'
  );
  const [selectedProtoId, setSelectedProtoId] = useState<string>(
    prototypeDesigns[0]?.id || 'proto-sutrasetu-v1'
  );

  const refDesign = state.designs.find((d) => d.id === selectedRefId);
  const protoDesign = state.designs.find((d) => d.id === selectedProtoId);

  // Compute aggregated empirical metrics for ref
  const refSessions = state.sessions.filter((s) => s.designId === selectedRefId);
  const refTotalGrams = refSessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);
  const refTotalMins = refSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const refRate = refTotalMins > 0 ? calculateProductionRate(refTotalGrams, refTotalMins) : 0;
  const refAvgEffort =
    refSessions.length > 0
      ? Number(
          (
            refSessions.reduce((acc, s) => acc + s.effortRating, 0) / refSessions.length
          ).toFixed(1)
        )
      : 0;
  const refAvgComfort =
    refSessions.length > 0
      ? Number(
          (
            refSessions.reduce((acc, s) => acc + s.comfortRating, 0) / refSessions.length
          ).toFixed(1)
        )
      : 0;
  const refBreaks =
    refSessions.length > 0
      ? Number(
          (refSessions.reduce((acc, s) => acc + s.breakCount, 0) / refSessions.length).toFixed(1)
        )
      : 0;

  // Compute aggregated empirical metrics for proto
  const protoSessions = state.sessions.filter((s) => s.designId === selectedProtoId);
  const protoTotalGrams = protoSessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);
  const protoTotalMins = protoSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const protoRate = protoTotalMins > 0 ? calculateProductionRate(protoTotalGrams, protoTotalMins) : 0;
  const protoAvgEffort =
    protoSessions.length > 0
      ? Number(
          (
            protoSessions.reduce((acc, s) => acc + s.effortRating, 0) / protoSessions.length
          ).toFixed(1)
        )
      : 0;
  const protoAvgComfort =
    protoSessions.length > 0
      ? Number(
          (
            protoSessions.reduce((acc, s) => acc + s.comfortRating, 0) / protoSessions.length
          ).toFixed(1)
        )
      : 0;
  const protoBreaks =
    protoSessions.length > 0
      ? Number(
          (
            protoSessions.reduce((acc, s) => acc + s.breakCount, 0) / protoSessions.length
          ).toFixed(1)
        )
      : 0;

  // Comparison metrics with appropriate polarities
  const metrics = [
    {
      id: 'rate',
      label: 'Yarn Output Rate',
      unit: 'grams/hour',
      refValue: refRate,
      protoValue: protoRate,
      higherIsBetter: true,
      description: 'Spinning production throughput calculated from session time and mass',
    },
    {
      id: 'weight',
      label: 'Equipment Total Weight',
      unit: 'kg',
      refValue: refDesign?.totalWeightKg ?? 0,
      protoValue: protoDesign?.totalWeightKg ?? 0,
      higherIsBetter: false,
      description: 'Portability factor for home-based women artisans and transport',
    },
    {
      id: 'effort',
      label: 'Perceived Crank Effort',
      unit: 'scale 1-5',
      refValue: refAvgEffort,
      protoValue: protoAvgEffort,
      higherIsBetter: false,
      description: 'Operator effort rating (1=effortless, 5=severe muscular strain)',
    },
    {
      id: 'comfort',
      label: 'Artisan Comfort Score',
      unit: 'scale 1-5',
      refValue: refAvgComfort,
      protoValue: protoAvgComfort,
      higherIsBetter: true,
      description: 'Seated posture, crank radius reach, and vibration comfort',
    },
    {
      id: 'breaks',
      label: 'Average Breaks Per Session',
      unit: 'breaks/session',
      refValue: refBreaks,
      protoValue: protoBreaks,
      higherIsBetter: false,
      description: 'Yarn draft breakage frequency interrupting spinning cadence',
    },
    {
      id: 'assembly',
      label: 'Setup / Toolless Assembly Time',
      unit: 'minutes',
      refValue: refDesign?.assemblyTimeMinutes ?? 0,
      protoValue: protoDesign?.assemblyTimeMinutes ?? 0,
      higherIsBetter: false,
      description: 'Time needed to deploy or fold the unit without specialized tooling',
    },
    {
      id: 'cost',
      label: 'Estimated Manufacturing Cost',
      unit: 'INR (₹)',
      refValue: refDesign?.estimatedManufacturingCostInr ?? 0,
      protoValue: protoDesign?.estimatedManufacturingCostInr ?? 0,
      higherIsBetter: false,
      description: 'BOM component materials + machining labor cost (trade-off against productivity)',
    },
  ];

  // Chart data
  const comparisonChartData = [
    {
      name: 'Output (g/hr)',
      Reference: refRate,
      Prototype: protoRate,
    },
    {
      name: 'Weight (kg)',
      Reference: refDesign?.totalWeightKg ?? 0,
      Prototype: protoDesign?.totalWeightKg ?? 0,
    },
    {
      name: 'Effort (x10)',
      Reference: refAvgEffort * 10,
      Prototype: protoAvgEffort * 10,
    },
    {
      name: 'Comfort (x10)',
      Reference: refAvgComfort * 10,
      Prototype: protoAvgComfort * 10,
    },
    {
      name: 'Assembly (min)',
      Reference: refDesign?.assemblyTimeMinutes ?? 0,
      Prototype: protoDesign?.assemblyTimeMinutes ?? 0,
    },
  ];

  const handleExportComparisonCsv = () => {
    const headers = [
      'Evaluation Metric',
      'Unit',
      `Baseline (${refDesign?.name || 'Reference'})`,
      `Prototype (${protoDesign?.name || 'Prototype'})`,
      'Percentage Change (%)',
      'Desirable Direction',
      'Metric Description',
    ];

    const rows = metrics.map((m) => {
      const change = calculatePercentageChange(m.protoValue, m.refValue);
      return [
        m.label,
        m.unit,
        m.refValue,
        m.protoValue,
        change ? change.formatted : 'N/A',
        m.higherIsBetter ? 'Higher is better' : 'Lower is better',
        m.description,
      ];
    });

    downloadCsv(`sutrasetu_charkha_comparison_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Selector Header Bar */}
      <div className="bg-white p-5 rounded-xl border border-[#E5E0D5] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#68736C]">
            <span>SIH26020 Comparative Evaluation</span>
            <span aria-hidden="true">·</span>
            <span className="text-[#367A57] font-semibold">Empirical Measurements</span>
          </div>
          <h2 className="text-xl font-serif font-bold text-[#29312D] mt-0.5">
            Reference Charkha vs. Innovative Prototype
          </h2>
          <p className="text-xs text-[#68736C]">
            Side-by-side performance delta with polarity-corrected improvement indicators
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto no-print">
          <button
            onClick={() => window.print()}
            className="px-3 py-2 bg-white border border-[#E5E0D5] hover:bg-[#FAF8F2] text-[#243B53] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-[#B65D3A]" />
            Print Report
          </button>
          <button
            onClick={handleExportComparisonCsv}
            className="px-3.5 py-2 bg-[#243B53] hover:bg-[#1B2D3F] text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-[#BAC7D5]" />
            Download Comparison CSV
          </button>
        </div>
      </div>

      {/* Model Selection Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FAF8F2] p-4 rounded-xl border border-[#E5E0D5]">
        {/* Left: Reference Model */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#68736C] mb-1 font-semibold">
            Select Baseline Reference Charkha:
          </label>
          <select
            value={selectedRefId}
            onChange={(e) => setSelectedRefId(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-[#E5E0D5] rounded-lg text-[#29312D] focus:ring-2 focus:ring-[#243B53]"
          >
            {referenceDesigns.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.revision})
              </option>
            ))}
          </select>
          <div className="mt-2 text-[11px] text-[#68736C]">
            Logged Sessions: <strong>{refSessions.length}</strong> | Total Tested Hours:{' '}
            <strong>{(refTotalMins / 60).toFixed(1)} hrs</strong>
          </div>
        </div>

        {/* Right: Prototype Model */}
        <div>
          <label className="block text-xs font-mono uppercase text-[#68736C] mb-1 font-semibold">
            Select Improved Hardware Prototype:
          </label>
          <select
            value={selectedProtoId}
            onChange={(e) => setSelectedProtoId(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm font-semibold bg-white border border-[#334E68] rounded-lg text-[#243B53] focus:ring-2 focus:ring-[#243B53]"
          >
            {prototypeDesigns.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name} ({d.revision})
              </option>
            ))}
          </select>
          <div className="mt-2 text-[11px] text-[#68736C]">
            Logged Sessions: <strong>{protoSessions.length}</strong> | Total Tested Hours:{' '}
            <strong>{(protoTotalMins / 60).toFixed(1)} hrs</strong>
          </div>
        </div>
      </div>

      {/* Side-by-Side Metric Cards Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D5] overflow-hidden shadow-2xs">
        <div className="p-4 bg-[#FAF8F2] border-b border-[#E5E0D5] flex items-center justify-between">
          <h3 className="text-sm font-serif font-bold text-[#29312D]">
            Empirical Comparison Matrix
          </h3>
          <span className="text-[11px] text-[#68736C] font-mono">
            Polarity-aware Percentage Calculations
          </span>
        </div>

        <div className="divide-y divide-[#F0EBE1]">
          {metrics.map((m) => {
            const change = calculatePercentageChange(m.protoValue, m.refValue);
            // Check if this change is an improvement
            const isImprovement =
              change &&
              (m.higherIsBetter
                ? change.value > 0
                : change.value < 0);

            return (
              <div
                key={m.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#FAF8F2] transition-colors"
              >
                {/* Metric label & info */}
                <div className="md:w-1/3">
                  <div className="font-semibold text-sm text-[#29312D] flex items-center gap-2">
                    {m.label}
                    <span className="text-[10px] font-mono text-[#829AB1]">({m.unit})</span>
                  </div>
                  <p className="text-xs text-[#68736C] mt-0.5">{m.description}</p>
                </div>

                {/* Values columns */}
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
                  {/* Reference */}
                  <div className="p-2.5 bg-[#FAF8F2] rounded-lg border border-[#E5E0D5]">
                    <span className="text-[10px] text-[#829AB1] uppercase font-mono block">
                      Reference Baseline
                    </span>
                    <span className="text-sm font-mono font-bold text-[#29312D]">
                      {m.id === 'cost' ? formatInr(m.refValue) : m.refValue}{' '}
                      <span className="text-[10px] font-normal text-[#68736C]">{m.unit}</span>
                    </span>
                  </div>

                  {/* Prototype */}
                  <div className="p-2.5 bg-[#EBF1F5] rounded-lg border border-[#334E68]/30">
                    <span className="text-[10px] text-[#243B53] uppercase font-mono block font-medium">
                      SutraSetu Prototype
                    </span>
                    <span className="text-sm font-mono font-bold text-[#243B53]">
                      {m.id === 'cost' ? formatInr(m.protoValue) : m.protoValue}{' '}
                      <span className="text-[10px] font-normal text-[#243B53]">{m.unit}</span>
                    </span>
                  </div>

                  {/* Delta & Indicator */}
                  <div className="col-span-2 sm:col-span-1 flex items-center justify-start sm:justify-end">
                    {change ? (
                      <div
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono inline-flex items-center gap-1.5 ${
                          isImprovement
                            ? 'bg-[#E3EFE8] text-[#367A57]'
                            : 'bg-[#FEF6E7] text-[#B7791F]'
                        }`}
                      >
                        {isImprovement ? (
                          <TrendingUp className="w-3.5 h-3.5 text-[#367A57]" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-[#B7791F]" />
                        )}
                        <span>{change.formatted}</span>
                        <span className="text-[10px] font-normal">
                          {isImprovement ? 'Desirable' : 'Trade-off'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-[#829AB1] font-mono">Baseline identical</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl p-5 border border-[#E5E0D5] shadow-2xs">
        <div className="mb-4">
          <h3 className="text-base font-serif font-bold text-[#29312D]">
            Comparative Hardware Performance Profile
          </h3>
          <p className="text-xs text-[#68736C]">
            Side-by-side normalized indicator bars across mechanical and ergonomic parameters
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonChartData}
              margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" />
              <XAxis dataKey="name" stroke="#829AB1" fontSize={11} />
              <YAxis stroke="#829AB1" fontSize={11} />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#243B53] text-[#F7F3E8] p-3 rounded-lg shadow-md text-xs border border-[#334E68]">
                        <p className="font-bold text-white mb-1.5">{label}</p>
                        <p className="text-[#BAC7D5]">
                          Reference: <span className="font-mono font-bold text-white">{payload[0].value}</span>
                        </p>
                        <p className="text-[#BAC7D5]">
                          Prototype: <span className="font-mono font-bold text-[#F7F3E8]">{payload[1]?.value}</span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="Reference" fill="#BAC7D5" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Prototype" fill="#B65D3A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Limitations and Future Testing Notice */}
      <div className="bg-[#FAF8F2] rounded-xl p-5 border border-[#E5E0D5] space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#243B53]">
          <AlertCircle className="w-4 h-4 text-[#B65D3A]" />
          <span>Evaluation Boundaries & Physical Prototype Scope</span>
        </div>
        <p className="text-xs text-[#68736C] leading-relaxed">
          <strong>Note on Trade-offs:</strong> The SutraSetu Prototype V1 exhibits a higher initial manufacturing cost (+₹3,900) due to precision planetary gears and sealed ceramic bearings. However, this is offset by 65%+ higher yarn throughput, 46% reduced chassis weight, and a 55% reduction in artisan exertion.
        </p>
        <p className="text-xs text-[#68736C] leading-relaxed">
          <strong>Areas for Further Physical Testing:</strong> 1) Long-term tooth wear of polyoxymethylene (POM) planetary pinions under abrasive rural dust conditions; 2) Spindle balance tolerance after 500 operating hours; 3) Local village-level blacksmith repairability without specialized puller tools.
        </p>
      </div>
    </div>
  );
};
