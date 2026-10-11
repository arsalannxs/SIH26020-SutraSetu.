import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  X,
  Package,
  Wrench,
  Scale,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CharkhaDesign, DesignStatus, DesignType } from '../../types';
import { formatInr } from '../../utils/calculations';

export const DesignsTab: React.FC = () => {
  const { state, addDesign, updateDesign, deleteDesign } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'reference' | 'prototype'>('all');
  const [selectedDesign, setSelectedDesign] = useState<CharkhaDesign | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [designToDelete, setDesignToDelete] = useState<CharkhaDesign | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    type: DesignType;
    revision: string;
    status: DesignStatus;
    description: string;
    intendedImprovements: string;
    lengthCm: number;
    widthCm: number;
    heightCm: number;
    totalWeightKg: number;
    frameMaterial: string;
    driveMechanism: string;
    spindleCount: number;
    gearRatio: string;
    portabilityNotes: string;
    assemblyTimeMinutes: number;
    estimatedManufacturingCostInr: number;
    notes: string;
  }>({
    name: '',
    type: 'prototype',
    revision: 'V1.0',
    status: 'testing',
    description: '',
    intendedImprovements: '',
    lengthCm: 60,
    widthCm: 45,
    heightCm: 50,
    totalWeightKg: 8.5,
    frameMaterial: '6061 Aluminum & Treated Wood',
    driveMechanism: 'Planetary Gear & Poly-V Belt',
    spindleCount: 8,
    gearRatio: '1:32',
    portabilityNotes: 'Modular fold-flat design',
    assemblyTimeMinutes: 5,
    estimatedManufacturingCostInr: 12000,
    notes: '',
  });

  const handleOpenAdd = () => {
    setIsEditMode(false);
    setFormData({
      name: '',
      type: 'prototype',
      revision: 'V1.5',
      status: 'testing',
      description: '',
      intendedImprovements: 'Enclosed planetary drive\nShielded ball bearings\nErgonomic crank angle',
      lengthCm: 62,
      widthCm: 44,
      heightCm: 48,
      totalWeightKg: 8.0,
      frameMaterial: 'Anodized Aluminum Alloy',
      driveMechanism: 'Dual Planetary Gearbox with Poly-V Drive',
      spindleCount: 8,
      gearRatio: '1:32',
      portabilityNotes: 'Quick-release toolless assembly',
      assemblyTimeMinutes: 5,
      estimatedManufacturingCostInr: 11500,
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (design: CharkhaDesign) => {
    setIsEditMode(true);
    setSelectedDesign(design);
    setFormData({
      name: design.name,
      type: design.type,
      revision: design.revision,
      status: design.status,
      description: design.description,
      intendedImprovements: design.intendedImprovements.join('\n'),
      lengthCm: design.dimensions.lengthCm,
      widthCm: design.dimensions.widthCm,
      heightCm: design.dimensions.heightCm,
      totalWeightKg: design.totalWeightKg,
      frameMaterial: design.frameMaterial,
      driveMechanism: design.driveMechanism,
      spindleCount: design.spindleCount,
      gearRatio: design.gearRatio,
      portabilityNotes: design.portabilityNotes,
      assemblyTimeMinutes: design.assemblyTimeMinutes,
      estimatedManufacturingCostInr: design.estimatedManufacturingCostInr,
      notes: design.notes || '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const improvements = formData.intendedImprovements
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (isEditMode && selectedDesign) {
      updateDesign(selectedDesign.id, {
        name: formData.name.trim(),
        type: formData.type,
        revision: formData.revision.trim(),
        status: formData.status,
        description: formData.description.trim(),
        intendedImprovements: improvements,
        dimensions: {
          lengthCm: Number(formData.lengthCm),
          widthCm: Number(formData.widthCm),
          heightCm: Number(formData.heightCm),
        },
        totalWeightKg: Number(formData.totalWeightKg),
        frameMaterial: formData.frameMaterial.trim(),
        driveMechanism: formData.driveMechanism.trim(),
        spindleCount: Number(formData.spindleCount),
        gearRatio: formData.gearRatio.trim(),
        portabilityNotes: formData.portabilityNotes.trim(),
        assemblyTimeMinutes: Number(formData.assemblyTimeMinutes),
        estimatedManufacturingCostInr: Number(formData.estimatedManufacturingCostInr),
        notes: formData.notes.trim() || undefined,
      });
    } else {
      addDesign({
        name: formData.name.trim(),
        type: formData.type,
        revision: formData.revision.trim(),
        status: formData.status,
        description: formData.description.trim(),
        intendedImprovements: improvements,
        dimensions: {
          lengthCm: Number(formData.lengthCm),
          widthCm: Number(formData.widthCm),
          heightCm: Number(formData.heightCm),
        },
        totalWeightKg: Number(formData.totalWeightKg),
        frameMaterial: formData.frameMaterial.trim(),
        driveMechanism: formData.driveMechanism.trim(),
        spindleCount: Number(formData.spindleCount),
        gearRatio: formData.gearRatio.trim(),
        portabilityNotes: formData.portabilityNotes.trim(),
        assemblyTimeMinutes: Number(formData.assemblyTimeMinutes),
        estimatedManufacturingCostInr: Number(formData.estimatedManufacturingCostInr),
        notes: formData.notes.trim() || undefined,
      });
    }

    setIsModalOpen(false);
  };

  const filteredDesigns = state.designs.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.driveMechanism.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || d.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner and Search Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#29312D]">
            Charkha Hardware Design Registry
          </h2>
          <p className="text-xs text-[#68736C]">
            Mechanical specifications, BOM estimates and structural parameters for baseline and experimental prototypes
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          Register New Design
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829AB1]" />
          <input
            type="text"
            placeholder="Search by model name, drive mechanism, material..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243B53]"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1 bg-[#FAF8F2] p-1 border border-[#E5E0D5] rounded-lg self-stretch sm:self-auto">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-[#243B53] text-white'
                : 'text-[#68736C] hover:text-[#29312D]'
            }`}
          >
            All Designs ({state.designs.length})
          </button>
          <button
            onClick={() => setFilterType('prototype')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterType === 'prototype'
                ? 'bg-[#243B53] text-white'
                : 'text-[#68736C] hover:text-[#29312D]'
            }`}
          >
            Prototypes ({state.designs.filter((d) => d.type === 'prototype').length})
          </button>
          <button
            onClick={() => setFilterType('reference')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterType === 'reference'
                ? 'bg-[#243B53] text-white'
                : 'text-[#68736C] hover:text-[#29312D]'
            }`}
          >
            Baseline References ({state.designs.filter((d) => d.type === 'reference').length})
          </button>
        </div>
      </div>

      {/* Designs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDesigns.map((design) => {
          const isProto = design.type === 'prototype';
          return (
            <div
              key={design.id}
              className={`bg-white rounded-xl border transition-all flex flex-col justify-between shadow-2xs ${
                isProto
                  ? 'border-[#334E68] ring-1 ring-[#334E68]/10'
                  : 'border-[#E5E0D5]'
              }`}
            >
              <div className="p-5 space-y-4">
                {/* Header Tag */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded ${
                      isProto
                        ? 'bg-[#EBF1F5] text-[#243B53]'
                        : 'bg-[#F2ECE1] text-[#8F4426]'
                    }`}
                  >
                    {isProto ? 'Improved Prototype' : 'Baseline Reference'}
                  </span>
                  <span className="text-[11px] font-mono text-[#68736C]">
                    Rev: {design.revision}
                  </span>
                </div>

                {/* Title */}
                <div>
                  <h3 className="text-base font-serif font-bold text-[#29312D] leading-snug">
                    {design.name}
                  </h3>
                  <p className="text-xs text-[#68736C] mt-1 line-clamp-2">
                    {design.description}
                  </p>
                </div>

                {/* Key Spec Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#F0EBE1]">
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Weight</span>
                    <span className="font-mono font-bold text-[#243B53]">
                      {design.totalWeightKg} kg
                    </span>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Gear Ratio</span>
                    <span className="font-mono font-bold text-[#243B53]">
                      {design.gearRatio}
                    </span>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Spindles</span>
                    <span className="font-mono font-bold text-[#243B53]">
                      {design.spindleCount} Spindles
                    </span>
                  </div>
                  <div className="p-2 bg-[#FAF8F2] rounded-md">
                    <span className="text-[10px] text-[#68736C] uppercase block">Assembly</span>
                    <span className="font-mono font-bold text-[#243B53]">
                      {design.assemblyTimeMinutes} min
                    </span>
                  </div>
                </div>

                {/* Material & Drive */}
                <div className="space-y-1.5 text-xs text-[#29312D]">
                  <div className="flex items-start gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-[#B65D3A] shrink-0 mt-0.5" />
                    <span className="text-[#68736C]">
                      Frame:{' '}
                      <strong className="text-[#29312D] font-medium">
                        {design.frameMaterial}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#243B53] shrink-0 mt-0.5" />
                    <span className="text-[#68736C]">
                      Drive:{' '}
                      <strong className="text-[#29312D] font-medium">
                        {design.driveMechanism}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Improvements List */}
                {design.intendedImprovements.length > 0 && (
                  <div className="pt-2 border-t border-[#F0EBE1]">
                    <span className="text-[10px] font-semibold uppercase text-[#68736C] block mb-1">
                      Key Engineering Improvements:
                    </span>
                    <ul className="space-y-1 text-xs text-[#29312D]">
                      {design.intendedImprovements.slice(0, 3).map((imp, idx) => (
                        <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-[#367A57] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{imp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-[#FAF8F2] border-t border-[#E5E0D5] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-[#68736C] uppercase block">Estimated Mfg Cost</span>
                  <span className="font-mono font-bold text-sm text-[#243B53]">
                    {formatInr(design.estimatedManufacturingCostInr)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(design)}
                    className="p-1.5 text-[#68736C] hover:text-[#243B53] hover:bg-white rounded transition-colors"
                    title="Edit design specifications"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDesignToDelete(design)}
                    className="p-1.5 text-[#68736C] hover:text-[#B94040] hover:bg-white rounded transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {designToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-4 shadow-xl border border-[#E5E0D5]">
            <div className="flex items-center gap-3 text-[#B94040]">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif font-bold text-base text-[#29312D]">
                Confirm Design Record Deletion
              </h3>
            </div>
            <p className="text-xs text-[#68736C] leading-relaxed">
              Are you sure you want to delete the design record for{' '}
              <strong className="text-[#29312D]">{designToDelete.name}</strong>? Associated trial and session records will retain raw metrics but will no longer link to this chassis definition.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDesignToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#68736C] hover:bg-[#F7F3E8] rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  deleteDesign(designToDelete.id);
                  setDesignToDelete(null);
                }}
                className="px-4 py-2 text-xs font-bold bg-[#B94040] hover:bg-[#9E3535] text-white rounded-lg shadow-2xs"
              >
                Delete Design Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E0D5] w-full max-w-2xl max-h-[92vh] flex flex-col my-auto overflow-hidden">
            <div className="px-6 py-4 bg-[#243B53] text-[#F7F3E8] flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-white">
                {isEditMode ? 'Edit Charkha Design Record' : 'Register New Charkha Design'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#BAC7D5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Design Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                    placeholder="e.g. SutraSetu Planetary Prototype V1.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Design Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as DesignType })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  >
                    <option value="prototype">Improved Prototype</option>
                    <option value="reference">Baseline Reference</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Revision</label>
                  <input
                    type="text"
                    value={formData.revision}
                    onChange={(e) => setFormData({ ...formData, revision: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Total Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.totalWeightKg}
                    onChange={(e) =>
                      setFormData({ ...formData, totalWeightKg: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Est. Mfg Cost (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedManufacturingCostInr}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        estimatedManufacturingCostInr: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Spindles Count</label>
                  <input
                    type="number"
                    value={formData.spindleCount}
                    onChange={(e) =>
                      setFormData({ ...formData, spindleCount: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Gear Ratio</label>
                  <input
                    type="text"
                    value={formData.gearRatio}
                    onChange={(e) => setFormData({ ...formData, gearRatio: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                    placeholder="e.g. 1:32"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Assembly Time (mins)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.assemblyTimeMinutes}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assemblyTimeMinutes: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Frame & Chassis Material
                  </label>
                  <input
                    type="text"
                    value={formData.frameMaterial}
                    onChange={(e) => setFormData({ ...formData, frameMaterial: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Drive & Spindle Mechanism
                  </label>
                  <input
                    type="text"
                    value={formData.driveMechanism}
                    onChange={(e) => setFormData({ ...formData, driveMechanism: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  placeholder="Summary of mechanical architecture, ergonomic improvements, target use case..."
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Intended Engineering Improvements (one per line)
                </label>
                <textarea
                  rows={3}
                  value={formData.intendedImprovements}
                  onChange={(e) =>
                    setFormData({ ...formData, intendedImprovements: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs font-mono"
                  placeholder="Reduced crank effort&#10;Shielded bearings&#10;Toolless fold mechanism"
                />
              </div>

              <div className="pt-3 border-t border-[#E5E0D5] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#E5E0D5] rounded-lg font-medium text-[#68736C] hover:bg-[#F7F3E8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white rounded-lg font-bold shadow-2xs"
                >
                  {isEditMode ? 'Update Design' : 'Save Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
