import React, { useState } from 'react';
import {
  Activity,
  Plus,
  Download,
  Search,
  Filter,
  Trash2,
  Edit3,
  AlertTriangle,
  ArrowUpDown,
  Clock,
  HeartPulse,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SpinningSession } from '../../types';
import { calculateProductionRate } from '../../utils/calculations';
import { downloadCsv } from '../../utils/csvExport';

export const ProductionTab: React.FC = () => {
  const { state, setIsNewSessionModalOpen, deleteSession, updateSession } = useApp();

  const [search, setSearch] = useState('');
  const [filterDesign, setFilterDesign] = useState<string>('all');
  const [sortField, setSortField] = useState<'date' | 'rate' | 'grams'>('date');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [editingSession, setEditingSession] = useState<SpinningSession | null>(null);

  // Filter and sort sessions
  const filtered = state.sessions
    .filter((s) => {
      const design = state.designs.find((d) => d.id === s.designId);
      const matchesSearch =
        s.artisanOrOperatorId.toLowerCase().includes(search.toLowerCase()) ||
        (s.artisanName && s.artisanName.toLowerCase().includes(search.toLowerCase())) ||
        (s.cottonType && s.cottonType.toLowerCase().includes(search.toLowerCase())) ||
        (s.consistencyNotes && s.consistencyNotes.toLowerCase().includes(search.toLowerCase()));
      const matchesDesign = filterDesign === 'all' || s.designId === filterDesign;
      return matchesSearch && matchesDesign;
    })
    .sort((a, b) => {
      if (sortField === 'date') {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortAsc ? diff : -diff;
      }
      if (sortField === 'rate') {
        const rateA = calculateProductionRate(a.yarnProducedGrams, a.durationMinutes);
        const rateB = calculateProductionRate(b.yarnProducedGrams, b.durationMinutes);
        return sortAsc ? rateA - rateB : rateB - rateA;
      }
      if (sortField === 'grams') {
        return sortAsc
          ? a.yarnProducedGrams - b.yarnProducedGrams
          : b.yarnProducedGrams - a.yarnProducedGrams;
      }
      return 0;
    });

  const handleExportCsv = () => {
    const headers = [
      'Session ID',
      'Date',
      'Artisan ID',
      'Artisan Name',
      'Charkha Model',
      'Duration (Mins)',
      'Duration (Hours)',
      'Yarn Output (Grams)',
      'Production Rate (g/hr)',
      'Breaks Count',
      'Effort Rating (1-5)',
      'Comfort Rating (1-5)',
      'Cotton Sliver Type',
      'Consistency Observations',
      'Environment Notes',
      'Sample Data Flag',
    ];

    const rows = filtered.map((s) => {
      const design = state.designs.find((d) => d.id === s.designId);
      const rate = calculateProductionRate(s.yarnProducedGrams, s.durationMinutes);
      return [
        s.id,
        s.date,
        s.artisanOrOperatorId,
        s.artisanName || '',
        design?.name || s.designId,
        s.durationMinutes,
        (s.durationMinutes / 60).toFixed(2),
        s.yarnProducedGrams,
        rate,
        s.breakCount,
        s.effortRating,
        s.comfortRating,
        s.cottonType,
        s.consistencyNotes,
        s.environmentNotes || '',
        s.isSampleData ? 'Yes' : 'No',
      ];
    });

    downloadCsv(`sutrasetu_spinning_sessions_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSession) return;
    updateSession(editingSession.id, {
      artisanOrOperatorId: editingSession.artisanOrOperatorId,
      artisanName: editingSession.artisanName,
      date: editingSession.date,
      durationMinutes: Number(editingSession.durationMinutes),
      yarnProducedGrams: Number(editingSession.yarnProducedGrams),
      breakCount: Number(editingSession.breakCount),
      effortRating: Number(editingSession.effortRating),
      comfortRating: Number(editingSession.comfortRating),
      cottonType: editingSession.cottonType,
      consistencyNotes: editingSession.consistencyNotes,
    });
    setEditingSession(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#29312D]">
            Spinning Production Tracker
          </h2>
          <p className="text-xs text-[#68736C]">
            Empirical logging of hand-spinning duration, grams produced, break frequency and operator exertion
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2.5 bg-white border border-[#E5E0D5] hover:bg-[#FAF8F2] text-[#243B53] text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#B65D3A]" />
            Export CSV
          </button>
          <button
            onClick={() => setIsNewSessionModalOpen(true)}
            className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Record Session
          </button>
        </div>
      </div>

      {/* Critical Scientific Note Banner */}
      <div className="bg-[#FAF8F2] border border-[#EAE5D9] rounded-xl p-4 flex items-start gap-3 text-xs text-[#68736C]">
        <AlertTriangle className="w-4 h-4 text-[#B65D3A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-[#29312D]">
            Scientific Discipline & Yarn Quality Disclaimer:
          </p>
          <p className="leading-relaxed">
            Do not automatically assume that a higher spinning rate implies better yarn quality. Hand-spinning requires balancing twist per inch (TPI), count regularity, and fiber draft tension. High speed without mechanical balance can induce yarn breakage and uneven thickness. Cross-reference production rates with the <strong>Yarn Quality</strong> module.
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829AB1]" />
          <input
            type="text"
            placeholder="Search by artisan ID, name, cotton count, or notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243B53]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterDesign}
            onChange={(e) => setFilterDesign(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#E5E0D5] rounded-lg text-[#29312D] focus:outline-none focus:ring-2 focus:ring-[#243B53] flex-1 sm:flex-none"
          >
            <option value="all">All Charkha Models ({state.sessions.length})</option>
            {state.designs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (sortField === 'date') setSortField('rate');
              else if (sortField === 'rate') setSortField('grams');
              else setSortField('date');
            }}
            className="px-3 py-2 text-xs font-semibold bg-white border border-[#E5E0D5] rounded-lg text-[#243B53] flex items-center gap-1.5 hover:bg-[#FAF8F2]"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-[#B65D3A]" />
            <span>Sort: {sortField.toUpperCase()}</span>
          </button>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white rounded-xl border border-[#E5E0D5] overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#FAF8F2] border-b border-[#E5E0D5] text-[#68736C] uppercase font-mono text-[10px]">
                <th className="py-3 px-4">Date & Session</th>
                <th className="py-3 px-4">Artisan Operator</th>
                <th className="py-3 px-4">Charkha Model</th>
                <th className="py-3 px-4 text-right">Duration</th>
                <th className="py-3 px-4 text-right">Output (g)</th>
                <th className="py-3 px-4 text-right">Production Rate</th>
                <th className="py-3 px-4 text-center">Breaks</th>
                <th className="py-3 px-4 text-center">Effort (1-5)</th>
                <th className="py-3 px-4 text-center">Comfort</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0EBE1]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-8 text-center text-[#68736C]">
                    No spinning sessions match your query. Click "Record Session" above to add new trial observations.
                  </td>
                </tr>
              ) : (
                filtered.map((s) => {
                  const design = state.designs.find((d) => d.id === s.designId);
                  const rate = calculateProductionRate(s.yarnProducedGrams, s.durationMinutes);
                  return (
                    <tr key={s.id} className="hover:bg-[#FAF8F2] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-medium text-[#29312D]">{s.date}</div>
                        <span className="text-[10px] text-[#829AB1] font-mono">{s.id}</span>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#29312D]">
                          {s.artisanName || s.artisanOrOperatorId}
                        </div>
                        <div className="text-[10px] text-[#68736C]">{s.cottonType}</div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                            design?.type === 'prototype'
                              ? 'bg-[#EBF1F5] text-[#243B53]'
                              : 'bg-[#F2ECE1] text-[#8F4426]'
                          }`}
                        >
                          {design?.name || s.designId}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono text-[#29312D]">
                        {s.durationMinutes} mins
                        <span className="block text-[10px] text-[#829AB1]">
                          ({(s.durationMinutes / 60).toFixed(1)} hrs)
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-[#29312D]">
                        {s.yarnProducedGrams} g
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className="font-mono font-bold text-sm text-[#243B53]">
                          {rate}
                        </span>{' '}
                        <span className="text-[10px] text-[#68736C]">g/hr</span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            s.breakCount <= 2
                              ? 'bg-[#E3EFE8] text-[#367A57]'
                              : s.breakCount >= 6
                              ? 'bg-[#FBEAEA] text-[#B94040]'
                              : 'bg-[#FEF6E7] text-[#B7791F]'
                          }`}
                        >
                          {s.breakCount}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-[10px] font-bold ${
                            s.effortRating <= 2
                              ? 'bg-[#E3EFE8] text-[#367A57]'
                              : s.effortRating >= 4
                              ? 'bg-[#FBEAEA] text-[#B94040]'
                              : 'bg-[#FEF6E7] text-[#B7791F]'
                          }`}
                          title={`Effort score: ${s.effortRating}/5`}
                        >
                          {s.effortRating}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block w-5 h-5 rounded-full text-center leading-5 text-[10px] font-bold ${
                            s.comfortRating >= 4
                              ? 'bg-[#E3EFE8] text-[#367A57]'
                              : s.comfortRating <= 2
                              ? 'bg-[#FBEAEA] text-[#B94040]'
                              : 'bg-[#FEF6E7] text-[#B7791F]'
                          }`}
                          title={`Comfort score: ${s.comfortRating}/5`}
                        >
                          {s.comfortRating}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditingSession(s)}
                            className="p-1.5 text-[#68736C] hover:text-[#243B53] hover:bg-[#FAF8F2] rounded transition-colors"
                            title="Edit session"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteSession(s.id)}
                            className="p-1.5 text-[#68736C] hover:text-[#B94040] hover:bg-[#FAF8F2] rounded transition-colors"
                            title="Delete session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Session Modal */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-[#E5E0D5] w-full max-w-lg p-6 space-y-4">
            <h3 className="font-serif font-bold text-base text-[#29312D]">
              Edit Session: {editingSession.id}
            </h3>
            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSession.durationMinutes}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Output (Grams)</label>
                  <input
                    type="number"
                    min="1"
                    value={editingSession.yarnProducedGrams}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        yarnProducedGrams: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Breaks Count</label>
                  <input
                    type="number"
                    min="0"
                    value={editingSession.breakCount}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        breakCount: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Effort (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingSession.effortRating}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        effortRating: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Comfort (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={editingSession.comfortRating}
                    onChange={(e) =>
                      setEditingSession({
                        ...editingSession,
                        comfortRating: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Observations</label>
                <textarea
                  rows={2}
                  value={editingSession.consistencyNotes}
                  onChange={(e) =>
                    setEditingSession({
                      ...editingSession,
                      consistencyNotes: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 border border-[#E5E0D5] rounded-lg text-[#68736C] hover:bg-[#FAF8F2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#B65D3A] text-white font-bold rounded-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
