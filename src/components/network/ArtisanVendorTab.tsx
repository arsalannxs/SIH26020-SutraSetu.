import React, { useState } from 'react';
import {
  Users2,
  Plus,
  Search,
  Filter,
  MapPin,
  Phone,
  Mail,
  Building,
  Wrench,
  Trash2,
  X,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ArtisanVendorContact, PartnershipStatus, PartnerType } from '../../types';

export const ArtisanVendorTab: React.FC = () => {
  const { state, addContact, deleteContact } = useApp();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState<{
    name: string;
    organizationName: string;
    type: PartnerType;
    villageOrCity: string;
    district: string;
    state: string;
    contactPerson: string;
    phoneOrEmail: string;
    capabilities: string;
    partnershipStatus: PartnershipStatus;
    notes: string;
  }>({
    name: '',
    organizationName: '',
    type: 'artisan_shg',
    villageOrCity: '',
    district: '',
    state: '',
    contactPerson: '',
    phoneOrEmail: '',
    capabilities: 'Sliver spinning, home-based production',
    partnershipStatus: 'engaged',
    notes: '',
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      organizationName: '',
      type: 'artisan_shg',
      villageOrCity: '',
      district: '',
      state: 'Maharashtra',
      contactPerson: '',
      phoneOrEmail: '',
      capabilities: 'Hand-spinning, cluster trials',
      partnershipStatus: 'engaged',
      notes: '',
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.organizationName.trim()) return;

    addContact({
      name: formData.name.trim(),
      organizationName: formData.organizationName.trim(),
      type: formData.type,
      location: {
        villageOrCity: formData.villageOrCity.trim(),
        district: formData.district.trim(),
        state: formData.state.trim(),
      },
      contactPerson: formData.contactPerson.trim(),
      phoneOrEmail: formData.phoneOrEmail.trim() || undefined,
      capabilitiesOrNeeds: formData.capabilities
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      partnershipStatus: formData.partnershipStatus,
      notes: formData.notes.trim(),
    });

    setIsModalOpen(false);
  };

  const filtered = state.networkContacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.organizationName.toLowerCase().includes(search.toLowerCase()) ||
      c.location.district.toLowerCase().includes(search.toLowerCase()) ||
      c.location.state.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || c.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-[#E5E0D5]">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#29312D]">
            Artisan & Vendor Partner Network
          </h2>
          <p className="text-xs text-[#68736C]">
            Directory of grassroots Khadi institutions, self-help groups, and MSME precision machining vendors
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 bg-[#B65D3A] hover:bg-[#9E4D2D] text-white text-xs sm:text-sm font-bold rounded-lg shadow-2xs flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Partner Contact
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#829AB1]" />
          <input
            type="text"
            placeholder="Search by name, organization, state, or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#243B53]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs bg-white border border-[#E5E0D5] rounded-lg text-[#29312D] focus:outline-none focus:ring-2 focus:ring-[#243B53] flex-1 sm:flex-none"
          >
            <option value="all">All Partner Categories ({state.networkContacts.length})</option>
            <option value="khadi_institution">Khadi Institutions</option>
            <option value="artisan_shg">Artisan Self-Help Groups (SHGs)</option>
            <option value="fabrication_workshop">Fabrication & Machining Workshops</option>
            <option value="component_supplier">Component & Bearing Suppliers</option>
          </select>
        </div>
      </div>

      {/* Partner Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((c) => {
          return (
            <div
              key={c.id}
              className="bg-white rounded-xl border border-[#E5E0D5] p-5 shadow-2xs flex flex-col justify-between space-y-4 hover:border-[#334E68] transition-colors"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded capitalize ${
                      c.type === 'artisan_shg'
                        ? 'bg-[#E3EFE8] text-[#367A57]'
                        : c.type === 'khadi_institution'
                        ? 'bg-[#EBF1F5] text-[#243B53]'
                        : 'bg-[#FEF6E7] text-[#B7791F]'
                    }`}
                  >
                    {c.type.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                      c.partnershipStatus === 'scale_partner'
                        ? 'bg-[#367A57] text-white'
                        : c.partnershipStatus === 'active_trial'
                        ? 'bg-[#B65D3A] text-white'
                        : 'bg-[#FAF8F2] text-[#68736C]'
                    }`}
                  >
                    {c.partnershipStatus.replace('_', ' ')}
                  </span>
                </div>

                {/* Name */}
                <div>
                  <h3 className="font-serif font-bold text-base text-[#29312D]">
                    {c.organizationName}
                  </h3>
                  <p className="text-xs text-[#68736C]">{c.name}</p>
                </div>

                {/* Contact & Location Details */}
                <div className="space-y-1.5 text-xs text-[#68736C]">
                  <div className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B65D3A] shrink-0 mt-0.5" />
                    <span>
                      {c.location.villageOrCity}, {c.location.district},{' '}
                      <strong>{c.location.state}</strong>
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <Building className="w-3.5 h-3.5 text-[#243B53] shrink-0 mt-0.5" />
                    <span>Contact: {c.contactPerson}</span>
                  </div>
                  {c.phoneOrEmail && (
                    <div className="text-[11px] font-mono text-[#829AB1] pl-5">
                      {c.phoneOrEmail}
                    </div>
                  )}
                </div>

                {/* Capabilities / Needs */}
                {c.capabilitiesOrNeeds.length > 0 && (
                  <div className="pt-2 border-t border-[#F0EBE1]">
                    <span className="text-[10px] uppercase font-mono text-[#68736C] block mb-1">
                      Offerings & Requirements:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {c.capabilitiesOrNeeds.map((cap, i) => (
                        <span
                          key={i}
                          className="bg-[#FAF8F2] border border-[#E5E0D5] px-2 py-0.5 rounded text-[10px] text-[#29312D]"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#829AB1] truncate max-w-[200px]" title={c.notes}>
                  {c.notes || 'Partner record logged.'}
                </span>
                <button
                  onClick={() => deleteContact(c.id)}
                  className="text-[#68736C] hover:text-[#B94040] p-1 rounded transition-colors"
                  title="Remove contact"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-[#E5E0D5] w-full max-w-lg max-h-[92vh] flex flex-col my-auto overflow-hidden">
            <div className="px-6 py-4 bg-[#243B53] text-[#F7F3E8] flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-white">
                Add Partner or Supplier Record
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#BAC7D5] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.organizationName}
                    onChange={(e) =>
                      setFormData({ ...formData, organizationName: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                    placeholder="e.g. Wardha Khadi Kendra"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Short Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                    placeholder="e.g. Wardha Ashram"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Partner Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as PartnerType })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  >
                    <option value="khadi_institution">Khadi Institution</option>
                    <option value="artisan_shg">Artisan Self-Help Group</option>
                    <option value="fabrication_workshop">Fabrication Workshop</option>
                    <option value="component_supplier">Component Supplier</option>
                    <option value="evaluation_agency">Evaluation Agency</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Status</label>
                  <select
                    value={formData.partnershipStatus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        partnershipStatus: e.target.value as PartnershipStatus,
                      })
                    }
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  >
                    <option value="inquiry">Initial Inquiry</option>
                    <option value="engaged">Engaged</option>
                    <option value="active_trial">Active Trial Partner</option>
                    <option value="scale_partner">Scale-Up Partner</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">City / Village</label>
                  <input
                    type="text"
                    value={formData.villageOrCity}
                    onChange={(e) => setFormData({ ...formData, villageOrCity: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">District</label>
                  <input
                    type="text"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Contact Person</label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[#68736C]">Phone or Email</label>
                  <input
                    type="text"
                    value={formData.phoneOrEmail}
                    onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">
                  Capabilities / Services Offered (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.capabilities}
                  onChange={(e) => setFormData({ ...formData, capabilities: e.target.value })}
                  className="w-full px-3 py-2 border border-[#E5E0D5] rounded-lg text-xs"
                  placeholder="e.g. CNC machining, planetary gear hobbing"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-[#68736C]">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
