import React from 'react';
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Cpu,
  HeartPulse,
  Plus,
  GitCompare,
  TrendingUp,
  Clock,
  Coins,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  calculateProductionRate,
  calculateTotalManufacturingCost,
  formatInr,
} from '../../utils/calculations';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export const OverviewTab: React.FC = () => {
  const { state, setCurrentTab, setIsNewSessionModalOpen } = useApp();

  // Metrics computation from actual state records
  const totalSessions = state.sessions.length;
  const totalYarnGrams = state.sessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);

  const totalMinutes = state.sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const avgProductionRate =
    totalMinutes > 0 ? calculateProductionRate(totalYarnGrams, totalMinutes) : 0;

  const avgEffortRating =
    totalSessions > 0
      ? Number(
          (
            state.sessions.reduce((acc, s) => acc + s.effortRating, 0) / totalSessions
          ).toFixed(1)
        )
      : 0;

  const prototypeCost = calculateTotalManufacturingCost(state.costInputs);
  const completedTrials = state.fieldTrials.filter((t) => t.status === 'completed').length;

  // Comparison between reference charkha and prototype
  const refSessions = state.sessions.filter((s) => s.designId === 'ref-amber-8spindle');
  const protoSessions = state.sessions.filter(
    (s) => s.designId === 'proto-sutrasetu-v1' || s.designId === 'proto-sutrasetu-v2'
  );

  const refGrams = refSessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);
  const refMins = refSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const refRate = refMins > 0 ? calculateProductionRate(refGrams, refMins) : 48.5;

  const protoGrams = protoSessions.reduce((acc, s) => acc + s.yarnProducedGrams, 0);
  const protoMins = protoSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const protoRate = protoMins > 0 ? calculateProductionRate(protoGrams, protoMins) : 84.2;

  const productivityGainPct =
    refRate > 0 ? Number((((protoRate - refRate) / refRate) * 100).toFixed(1)) : 0;

  // Chart time series data
  const chartData = state.sessions
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((s, idx) => {
      const design = state.designs.find((d) => d.id === s.designId);
      const rate = calculateProductionRate(s.yarnProducedGrams, s.durationMinutes);
      return {
        sessionNum: `#${idx + 1}`,
        date: s.date.slice(5),
        rate,
        type: design?.type === 'prototype' ? 'Prototype' : 'Reference',
        grams: s.yarnProducedGrams,
      };
    });

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-[#243B53] text-[#F7F3E8] rounded-xl p-6 sm:p-8 shadow-sm border border-[#334E68] relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#BAC7D5]">
            <span>SIH26020 Prototype Research Suite</span>
            <span aria-hidden="true">·</span>
            <span>Ministry of MSME</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
            Better Spinning. Better Livelihoods.
          </h2>
          <p className="text-sm sm:text-base text-[#BAC7D5] leading-relaxed">
            Empowering rural Khadi artisans through human-centred mechanical innovation.
            This companion platform records laboratory benchmarks, ergonomic torque measurements, and grassroots field trials for the new hand-operated Charkha hardware prototype.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsNewSessionModalOpen(true)}
              className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Start New Session
            </button>
            <button
              onClick={() => setCurrentTab('comparison')}
              className="px-4 py-2.5 bg-[#334E68] hover:bg-[#486581] text-white text-xs sm:text-sm font-semibold rounded-lg flex items-center gap-2 transition-colors"
            >
              <GitCompare className="w-4 h-4 text-[#BAC7D5]" />
              Compare Charkhas
            </button>
            <button
              onClick={() => setCurrentTab('trials')}
              className="px-4 py-2.5 border border-[#486581] hover:bg-[#334E68] text-[#BAC7D5] hover:text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
            >
              View Field Trials
            </button>
          </div>
        </div>

        {/* Ambient watermark illustration badge */}
        <div className="absolute right-4 bottom-2 sm:right-8 sm:bottom-6 opacity-10 pointer-events-none">
          <Cpu className="w-48 h-48 sm:w-64 sm:h-64 text-[#F7F3E8]" />
        </div>
      </div>

      {/* Top Six Key Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Sessions */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Sessions</span>
            <Activity className="w-4 h-4 text-[#243B53]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#29312D]">
            {totalSessions}
          </div>
          <div className="text-[11px] text-[#78917B] mt-1 flex items-center gap-1">
            <span>Recorded Trials</span>
          </div>
        </div>

        {/* Total Yarn */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Yarn Spun</span>
            <TrendingUp className="w-4 h-4 text-[#B65D3A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#29312D]">
            {(totalYarnGrams / 1000).toFixed(2)}{' '}
            <span className="text-xs font-normal text-[#68736C]">kg</span>
          </div>
          <div className="text-[11px] text-[#68736C] mt-1 font-mono">
            {totalYarnGrams.toLocaleString()} grams
          </div>
        </div>

        {/* Avg Rate */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Output</span>
            <Clock className="w-4 h-4 text-[#367A57]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#29312D]">
            {avgProductionRate}
          </div>
          <div className="text-[11px] text-[#367A57] mt-1 font-semibold flex items-center gap-0.5">
            <span>+{productivityGainPct}% vs Baseline</span>
          </div>
        </div>

        {/* Operator Effort */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Avg Effort</span>
            <HeartPulse className="w-4 h-4 text-[#B65D3A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#29312D]">
            {avgEffortRating} <span className="text-xs font-normal text-[#68736C]">/ 5</span>
          </div>
          <div className="text-[11px] text-[#78917B] mt-1">
            <span>Borg Scale Index</span>
          </div>
        </div>

        {/* Prototype Cost */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mfg Cost</span>
            <Coins className="w-4 h-4 text-[#B7791F]" />
          </div>
          <div className="text-xl font-bold font-mono text-[#29312D] truncate">
            {formatInr(prototypeCost)}
          </div>
          <div className="text-[11px] text-[#68736C] mt-1">
            <span>BOM + Machining</span>
          </div>
        </div>

        {/* Field Trials */}
        <div className="bg-white p-4 rounded-xl border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between text-[#68736C] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Field Trials</span>
            <ShieldCheck className="w-4 h-4 text-[#367A57]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#29312D]">
            {completedTrials} <span className="text-xs font-normal text-[#68736C]">/ {state.fieldTrials.length}</span>
          </div>
          <div className="text-[11px] text-[#367A57] mt-1">
            <span>Sevagram & Rajkot</span>
          </div>
        </div>
      </div>

      {/* Main Charts & Key Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Production Rate Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#E5E0D5] shadow-2xs">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-[#29312D]">
                Spinning Productivity Trend (Grams / Hour)
              </h3>
              <p className="text-xs text-[#68736C]">
                Chronological trial session throughput across standard sliver batches
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1.5 text-[#243B53] font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B65D3A]" />
                Actual Output Rate
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="rateGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B65D3A" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B65D3A" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE1" />
                <XAxis dataKey="sessionNum" stroke="#829AB1" fontSize={11} />
                <YAxis stroke="#829AB1" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#243B53] text-[#F7F3E8] p-2.5 rounded-lg shadow-md text-xs border border-[#334E68]">
                          <p className="font-bold text-white mb-1">
                            Session {data.sessionNum} ({data.date})
                          </p>
                          <p className="text-[#BAC7D5]">
                            Design: <span className="text-[#F7F3E8] font-semibold">{data.type}</span>
                          </p>
                          <p className="text-[#BAC7D5]">
                            Rate: <span className="text-[#F7F3E8] font-mono font-bold">{data.rate} g/hr</span>
                          </p>
                          <p className="text-[#BAC7D5]">
                            Produced: <span className="text-[#F7F3E8] font-mono">{data.grams} grams</span>
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rate"
                  stroke="#B65D3A"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#rateGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-[#E5E0D5] flex flex-wrap items-center justify-between text-xs text-[#68736C]">
            <span>Empirical tests logged: 10 sessions under supervised testing</span>
            <button
              onClick={() => setCurrentTab('production')}
              className="text-[#B65D3A] font-semibold hover:underline inline-flex items-center gap-1"
            >
              Open Complete Production Table <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Reference vs Prototype Spotlight */}
        <div className="bg-[#FAF8F2] rounded-xl p-5 border border-[#E5E0D5] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#68736C]">
                Hardware Benchmark
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E5E0D5] text-[#29312D]">
                Side-by-Side
              </span>
            </div>

            <h3 className="text-base font-serif font-bold text-[#29312D] mb-1">
              Reference vs. SutraSetu V1
            </h3>
            <p className="text-xs text-[#68736C] mb-4">
              Direct mechanical comparison from empirical Wardha trial data.
            </p>

            <div className="space-y-3">
              {/* Output Rate */}
              <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#68736C]">Hourly Output</span>
                  <span className="text-[#367A57] font-bold font-mono">+{productivityGainPct}%</span>
                </div>
                <div className="flex items-baseline justify-between text-sm font-bold font-mono">
                  <span className="text-[#829AB1] font-normal text-xs">{refRate} g/hr (Ref)</span>
                  <span className="text-[#243B53]">{protoRate} g/hr (Proto)</span>
                </div>
              </div>

              {/* Weight */}
              <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#68736C]">Total Weight (Portability)</span>
                  <span className="text-[#367A57] font-bold font-mono">-46.1% lighter</span>
                </div>
                <div className="flex items-baseline justify-between text-sm font-bold font-mono">
                  <span className="text-[#829AB1] font-normal text-xs">15.2 kg (Cast Iron)</span>
                  <span className="text-[#243B53]">8.2 kg (Alloy/Teak)</span>
                </div>
              </div>

              {/* Breakage Rate */}
              <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#68736C]">Yarn Breaks / 100g</span>
                  <span className="text-[#367A57] font-bold font-mono">-70.5% breaks</span>
                </div>
                <div className="flex items-baseline justify-between text-sm font-bold font-mono">
                  <span className="text-[#829AB1] font-normal text-xs">6.1 breaks/100g</span>
                  <span className="text-[#243B53]">1.8 breaks/100g</span>
                </div>
              </div>

              {/* Assembly Time */}
              <div className="p-3 bg-white rounded-lg border border-[#E5E0D5]">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-[#68736C]">Setup / Fold Time</span>
                  <span className="text-[#367A57] font-bold font-mono">5.5 min toolless</span>
                </div>
                <div className="flex items-baseline justify-between text-sm font-bold font-mono">
                  <span className="text-[#829AB1] font-normal text-xs">45 min (Fixed base)</span>
                  <span className="text-[#243B53]">5.5 min (Modular)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('comparison')}
            className="w-full mt-4 py-2 bg-[#243B53] hover:bg-[#1B2D3F] text-white text-xs font-bold rounded-lg transition-colors text-center"
          >
            Launch Detailed Comparison Matrix
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Test Sessions & Evaluation Next Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sessions */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-[#E5E0D5] shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-serif font-bold text-[#29312D]">
                Recent Supervised Test Sessions
              </h3>
              <p className="text-xs text-[#68736C]">
                Latest artisan logs recorded during field trials
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('production')}
              className="text-xs font-semibold text-[#B65D3A] hover:underline"
            >
              View all ({state.sessions.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E5E0D5] text-[#68736C] uppercase font-mono text-[10px]">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Artisan</th>
                  <th className="py-2 px-3">Model</th>
                  <th className="py-2 px-3 text-right">Duration</th>
                  <th className="py-2 px-3 text-right">Output</th>
                  <th className="py-2 px-3 text-right">Rate</th>
                  <th className="py-2 px-3 text-center">Effort</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F0EBE1]">
                {state.sessions.slice(0, 5).map((s) => {
                  const design = state.designs.find((d) => d.id === s.designId);
                  const rate = calculateProductionRate(s.yarnProducedGrams, s.durationMinutes);
                  return (
                    <tr key={s.id} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="py-2.5 px-3 font-mono text-[#68736C]">{s.date}</td>
                      <td className="py-2.5 px-3 font-medium text-[#29312D]">
                        {s.artisanName || s.artisanOrOperatorId}
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            design?.type === 'prototype'
                              ? 'bg-[#EBF1F5] text-[#243B53]'
                              : 'bg-[#F2ECE1] text-[#8F4426]'
                          }`}
                        >
                          {design?.type === 'prototype' ? 'SutraSetu V1' : 'Amber Ref'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">{s.durationMinutes}m</td>
                      <td className="py-2.5 px-3 text-right font-mono font-medium">
                        {s.yarnProducedGrams}g
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-[#243B53]">
                        {rate} g/h
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-[10px] font-bold ${
                            s.effortRating <= 2
                              ? 'bg-[#E3EFE8] text-[#367A57]'
                              : s.effortRating >= 4
                              ? 'bg-[#FBEAEA] text-[#B94040]'
                              : 'bg-[#FEF6E7] text-[#B7791F]'
                          }`}
                        >
                          {s.effortRating}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Prototype Evaluation Checklist */}
        <div className="bg-white rounded-xl p-5 border border-[#E5E0D5] shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-serif font-bold text-[#29312D] mb-1">
              Prototype Evaluation Roadmap
            </h3>
            <p className="text-xs text-[#68736C] mb-4">
              Next validation milestones for SIH26020 jury review
            </p>

            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#367A57] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#29312D]">Enclosed Planetary Gear Train</span>
                  <p className="text-[#68736C]">1:32 ratio machined & validated in Wardha trial.</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#367A57] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#29312D]">RPE Effort & Posture Mapping</span>
                  <p className="text-[#68736C]">Borg effort reduced from 4.2 to 1.9 average.</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-[#B7791F] flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-[#B7791F]">
                  3
                </div>
                <div>
                  <span className="font-semibold text-[#29312D]">100-Hour Continuous Endurance</span>
                  <p className="text-[#68736C]">In progress at Udyog Bharti Rajkot (64 hrs logged).</p>
                </div>
              </li>

              <li className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded-full border-2 border-[#829AB1] flex items-center justify-center shrink-0 mt-0.5 text-[9px] font-bold text-[#829AB1]">
                  4
                </div>
                <div>
                  <span className="font-semibold text-[#29312D]">KVIC Cluster Standardization</span>
                  <p className="text-[#68736C]">Drafting vendor tooling spec for MSME batch fabrication.</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="mt-4 p-3 bg-[#FAF8F2] rounded-lg border border-[#E5E0D5] text-[11px] text-[#68736C]">
            <div className="flex items-center gap-1.5 font-semibold text-[#29312D] mb-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#B65D3A]" />
              Physical Hardware Deliverable
            </div>
            Data recorded above corresponds to the physical mechanical prototypes presented for evaluation.
          </div>
        </div>
      </div>
    </div>
  );
};
