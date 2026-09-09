import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Property, PropertyType, PropertyPurpose, PropertyStatus } from '../../types';
import { CHITRAL_LOCATIONS, PROPERTY_IMAGES } from '../../data/seedData';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Check, 
  X, 
  Building2, 
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Eye,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';

interface AdminPropertiesProps {
  onViewPropertyDetails?: (propertyId: string) => void;
  isModalOpenExternal?: boolean;
  onCloseExternalModal?: () => void;
}

export const AdminProperties: React.FC<AdminPropertiesProps> = ({
  onViewPropertyDetails,
  isModalOpenExternal,
  onCloseExternalModal
}) => {
  const { properties, addProperty, updateProperty, deleteProperty, approveProperty, rejectProperty } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [filterType, setFilterType] = useState<string>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(isModalOpenExternal || false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('House');
  const [purpose, setPurpose] = useState<PropertyPurpose>('Sale');
  const [location, setLocation] = useState(CHITRAL_LOCATIONS[0]);
  const [size, setSize] = useState('');
  const [price, setPrice] = useState<number>(15000000);
  const [description, setDescription] = useState('');
  const [bedrooms, setBedrooms] = useState<number | ''>(3);
  const [bathrooms, setBathrooms] = useState<number | ''>(2);
  const [status, setStatus] = useState<PropertyStatus>('Active');
  const [assignedAgent, setAssignedAgent] = useState('Rafeeq Ahmad');
  const [commissionPercent, setCommissionPercent] = useState<number>(2);
  const [ownerName, setOwnerName] = useState('');
  const [ownerPhone, setOwnerPhone] = useState('');
  const [imageUrl, setImageUrl] = useState(PROPERTY_IMAGES.mountainHouses[0]);

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingProperty(null);
    setTitle('');
    setType('House');
    setPurpose('Sale');
    setLocation(CHITRAL_LOCATIONS[0]);
    setSize('10 Marla');
    setPrice(18000000);
    setDescription('Prime residential property with clean title documents, motorable access road, and water supply.');
    setBedrooms(4);
    setBathrooms(3);
    setStatus('Active');
    setAssignedAgent('Rafeeq Ahmad');
    setCommissionPercent(2);
    setOwnerName('Local Owner');
    setOwnerPhone('0345 5429230');
    setImageUrl(PROPERTY_IMAGES.mountainHouses[0]);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (prop: Property) => {
    setEditingProperty(prop);
    setTitle(prop.title);
    setType(prop.type);
    setPurpose(prop.purpose);
    setLocation(prop.location);
    setSize(prop.size);
    setPrice(prop.price);
    setDescription(prop.description);
    setBedrooms(prop.bedrooms || '');
    setBathrooms(prop.bathrooms || '');
    setStatus(prop.status);
    setAssignedAgent(prop.assignedAgent || 'Rafeeq Ahmad');
    setCommissionPercent(prop.commissionPercent || 2);
    setOwnerName(prop.ownerName || '');
    setOwnerPhone(prop.ownerPhone || '');
    setImageUrl(prop.images[0] || PROPERTY_IMAGES.mountainHouses[0]);
    setIsModalOpen(true);
  };

  // Save Modal (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) return;

    if (editingProperty) {
      updateProperty(editingProperty.id, {
        title,
        type,
        purpose,
        location,
        size,
        price: Number(price),
        description,
        bedrooms: type === 'House' && bedrooms ? Number(bedrooms) : undefined,
        bathrooms: type === 'House' && bathrooms ? Number(bathrooms) : undefined,
        status,
        assignedAgent,
        commissionPercent: Number(commissionPercent),
        ownerName,
        ownerPhone,
        images: [imageUrl]
      });
    } else {
      addProperty({
        title,
        type,
        purpose,
        location,
        size,
        price: Number(price),
        description,
        bedrooms: type === 'House' && bedrooms ? Number(bedrooms) : undefined,
        bathrooms: type === 'House' && bathrooms ? Number(bathrooms) : undefined,
        features: ['Spring Water Access', 'Roadside Frontage', 'Clean Revenue Title'],
        images: [imageUrl],
        status,
        assignedAgent,
        commissionPercent: Number(commissionPercent),
        ownerName,
        ownerPhone
      });
    }

    setIsModalOpen(false);
    if (onCloseExternalModal) onCloseExternalModal();
  };

  // Filtered Properties
  const filtered = useMemo(() => {
    const seen = new Set<string>();
    return properties.filter((p) => {
      if (!p.id || seen.has(p.id)) return false;
      seen.add(p.id);
      if (filterStatus !== 'All' && p.status !== filterStatus) return false;
      if (filterType !== 'All' && p.type !== filterType) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          (p.ownerName && p.ownerName.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [properties, filterStatus, filterType, searchQuery]);

  const getStatusBadge = (st: PropertyStatus) => {
    switch (st) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Pending Review':
        return 'bg-amber-100 text-amber-900 border-amber-300 font-bold animate-pulse';
      case 'Sold':
        return 'bg-slate-200 text-slate-800 border-slate-300';
      case 'Rented':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
            Manage Property Listings ({properties.length})
          </h2>
          <p className="text-xs text-[#5b6672]">
            Review public submissions, adjust asking prices, update statuses and commission rates.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Property</span>
        </button>
      </div>

      {/* Filter and Search Row */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, location, owner name, or ID..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Sold">Sold</option>
            <option value="Rented">Rented</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="House">House</option>
            <option value="Land">Land</option>
            <option value="Commercial">Commercial</option>
            <option value="Building">Building</option>
          </select>
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Photo</th>
                <th className="py-3 px-4">Title & ID</th>
                <th className="py-3 px-4">Type / Purpose</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Demand Price</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Owner / Agent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((prop) => (
                <tr key={prop.id} className="hover:bg-stone-50/70 transition-colors">
                  {/* Photo Thumbnail */}
                  <td className="py-3 px-4">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-14 h-11 object-cover rounded-lg border border-stone-200 shrink-0"
                    />
                  </td>

                  {/* Title & Ref */}
                  <td className="py-3 px-4 max-w-[220px]">
                    <div className="font-bold text-[#0f2f45] truncate" title={prop.title}>
                      {prop.title}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">
                      ID: {prop.id.toUpperCase()} • {prop.size}
                    </div>
                  </td>

                  {/* Type / Purpose */}
                  <td className="py-3 px-4">
                    <span className="font-semibold text-slate-800 block">{prop.type}</span>
                    <span className={`text-[10px] font-bold ${prop.purpose === 'Rent' ? 'text-blue-600' : 'text-emerald-700'}`}>
                      For {prop.purpose}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-slate-600 max-w-[140px] truncate">
                    {prop.location}
                  </td>

                  {/* Price */}
                  <td className="py-3 px-4 font-bold text-[#0f2f45] whitespace-nowrap">
                    Rs. {prop.price.toLocaleString('en-PK')}
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(prop.status)}`}>
                      {prop.status}
                    </span>
                  </td>

                  {/* Owner / Agent */}
                  <td className="py-3 px-4 text-[11px]">
                    <div className="font-medium text-slate-800">{prop.ownerName || 'Self'}</div>
                    <div className="text-slate-400">{prop.assignedAgent || 'Unassigned'}</div>
                  </td>

                  {/* Row Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      {/* Approve / Reject buttons for pending review items */}
                      {prop.status === 'Pending Review' && (
                        <>
                          <button
                            onClick={() => approveProperty(prop.id)}
                            className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition-colors"
                            title="Approve & Publish Property"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => rejectProperty(prop.id)}
                            className="p-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 transition-colors"
                            title="Reject Submission"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(prop)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-slate-700 transition-colors"
                        title="Edit Property"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete "${prop.title}"?`)) {
                            deleteProperty(prop.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Property"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Property Modal with Internal-only fields */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 my-8 animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-[#0f2f45] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand text-lg font-bold">
                  {editingProperty ? 'Edit Property Listing' : 'Add New Property to Inventory'}
                </h3>
                <p className="text-xs text-emerald-300">
                  Internal Agency Management & Valuation Record
                </p>
              </div>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  if (onCloseExternalModal) onCloseExternalModal();
                }}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. 10 Marla Luxury House in Singoor"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Property Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-stone-50"
                  >
                    <option value="House">House</option>
                    <option value="Land">Land</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Building">Building</option>
                  </select>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Purpose
                  </label>
                  <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value as PropertyPurpose)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-stone-50"
                  >
                    <option value="Sale">For Sale</option>
                    <option value="Rent">For Rent</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-stone-50"
                  >
                    {CHITRAL_LOCATIONS.map((l) => (
                      <option key={l} value={l}>{l}</option>
                    ))}
                  </select>
                </div>

                {/* Size */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g. 10 Marla"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                {/* Asking Price */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold text-[#0f2f45]"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Cover Photo URL
                  </label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                {/* Bedrooms & Bathrooms */}
                {type === 'House' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                        Bedrooms
                      </label>
                      <input
                        type="number"
                        value={bedrooms}
                        onChange={(e) => setBedrooms(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                        Bathrooms
                      </label>
                      <input
                        type="number"
                        value={bathrooms}
                        onChange={(e) => setBathrooms(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </>
                )}

                {/* Internal Fields Section */}
                <div className="sm:col-span-2 pt-2 border-t border-stone-200">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#2f6b3a] block mb-2">
                    Internal Agency Management Fields
                  </span>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Listing Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold text-slate-800 bg-stone-50"
                  >
                    <option value="Active">Active (Published)</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Sold">Sold</option>
                    <option value="Rented">Rented</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Assigned Agent */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Assigned Agent
                  </label>
                  <select
                    value={assignedAgent}
                    onChange={(e) => setAssignedAgent(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-stone-50"
                  >
                    <option value="Rafeeq Ahmad">Rafeeq Ahmad</option>
                    <option value="Junaid Chitrali">Junaid Chitrali</option>
                    <option value="Farhan Ali">Farhan Ali</option>
                    <option value="Sardar Wali">Sardar Wali</option>
                  </select>
                </div>

                {/* Commission % */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Agency Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

                {/* Owner Info */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Owner Name & Phone
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Owner Name"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-1/2 px-2.5 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Phone"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-1/2 px-2.5 py-2 border border-stone-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>

              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2f6b3a] hover:bg-[#25552e] text-white rounded-lg text-xs font-bold shadow-md"
                >
                  {editingProperty ? 'Save Changes' : 'Create Listing'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
