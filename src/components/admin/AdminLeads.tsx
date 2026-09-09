import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Lead, LeadStatus } from '../../types';
import { 
  Search, 
  Filter, 
  LayoutGrid, 
  ListFilter, 
  Phone, 
  Mail, 
  Clock, 
  MessageSquare, 
  CheckCircle2, 
  Calendar,
  AlertCircle,
  Plus,
  Trash2,
  X
} from 'lucide-react';

export const AdminLeads: React.FC = () => {
  const { leads, updateLeadStatus, addLead, deleteLead, settings } = useStore();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Lead State
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPropertyTitle, setNewPropertyTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const statuses: LeadStatus[] = ['New', 'Contacted', 'Visiting', 'Closed', 'Negative'];

  const statusColors: Record<LeadStatus, { bg: string; text: string; border: string; columnBg: string }> = {
    New: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', columnBg: 'bg-blue-50/50' },
    Contacted: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', columnBg: 'bg-purple-50/50' },
    Visiting: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', columnBg: 'bg-amber-50/50' },
    Closed: { bg: 'bg-emerald-100', text: 'text-emerald-800', border: 'border-emerald-200', columnBg: 'bg-emerald-50/50' },
    Negative: { bg: 'bg-rose-100', text: 'text-rose-800', border: 'border-rose-200', columnBg: 'bg-rose-50/50' }
  };

  const filteredLeads = useMemo(() => {
    const seen = new Set<string>();
    return leads.filter((lead) => {
      if (!lead.id || seen.has(lead.id)) return false;
      seen.add(lead.id);

      if (filterStatus !== 'All' && lead.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          lead.name.toLowerCase().includes(q) ||
          lead.phone.toLowerCase().includes(q) ||
          (lead.propertyTitle && lead.propertyTitle.toLowerCase().includes(q)) ||
          (lead.notes && lead.notes.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [leads, filterStatus, searchQuery]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    addLead({
      name: newName,
      phone: newPhone,
      email: newEmail.trim() || undefined,
      propertyTitle: newPropertyTitle.trim() || undefined,
      status: 'New',
      notes: newNotes.trim() || undefined
    });

    setNewName('');
    setNewPhone('');
    setNewEmail('');
    setNewPropertyTitle('');
    setNewNotes('');
    setIsAddModalOpen(false);
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const target = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.replace(/^0/, '')}`;
    const text = encodeURIComponent(`Assalam-o-Alaikum ${name}! This is Rafeeq Homes and Properties Chitral regarding your real estate inquiry.`);
    window.open(`https://wa.me/${target}?text=${text}`, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
            Leads & Inquiries Pipeline ({leads.length})
          </h2>
          <p className="text-xs text-[#5b6672]">
            Track buyer interest, phone follow-ups, and scheduled mountain site visits.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Toggle between Kanban and Table */}
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'kanban'
                  ? 'bg-white text-[#0f2f45] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-[#0f2f45] shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          {/* Add Lead */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Manual Lead</span>
          </button>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search leads by client name, phone number, or property..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="All">All Statuses ({leads.length})</option>
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st} ({leads.filter((l) => l.status === st).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* View Mode: Kanban Pipeline */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {statuses.map((columnStatus) => {
            const columnLeads = filteredLeads.filter((l) => l.status === columnStatus);
            const style = statusColors[columnStatus];

            return (
              <div
                key={columnStatus}
                className={`rounded-2xl border border-stone-200/80 p-3 flex flex-col ${style.columnBg} min-w-[240px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-stone-200/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${style.bg} ${style.border} border`} />
                    <span className="font-bold text-xs text-[#0f2f45] uppercase tracking-wider">
                      {columnStatus}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white text-slate-700 border border-stone-200">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards List in column */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-xs text-[#0f2f45]">{lead.name}</h4>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="text-slate-300 hover:text-rose-600 p-0.5"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {lead.propertyTitle && (
                        <div className="text-[11px] text-[#2f6b3a] font-semibold line-clamp-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {lead.propertyTitle}
                        </div>
                      )}

                      {lead.notes && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 italic">
                          "{lead.notes}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-stone-100 font-mono">
                        <span>{lead.phone}</span>
                        <span>{lead.date}</span>
                      </div>

                      {/* Status Dropdown inside card + Action Icons */}
                      <div className="flex items-center justify-between gap-2 pt-1">
                        <select
                          value={lead.status}
                          onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                          className="text-[10px] font-bold py-1 px-1.5 bg-stone-50 border border-stone-200 rounded-md text-slate-700 focus:outline-none"
                        >
                          {statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openWhatsApp(lead.phone, lead.name)}
                            className="p-1.5 rounded-md bg-[#25D366]/15 hover:bg-[#25D366]/30 text-[#128C7E] transition-colors"
                            title="Chat on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                          <a
                            href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                            className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-slate-700 transition-colors"
                            title="Call Lead"
                          >
                            <Phone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="py-8 text-center text-slate-400 text-[11px] italic">
                      No leads in {columnStatus}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* View Mode: Table */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Lead Name</th>
                  <th className="py-3 px-4">Contact Phone</th>
                  <th className="py-3 px-4">Property Inquired</th>
                  <th className="py-3 px-4">Current Status</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0f2f45]">{lead.name}</div>
                      {lead.email && <div className="text-[10px] text-slate-400">{lead.email}</div>}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-700">
                      {lead.phone}
                    </td>

                    <td className="py-3 px-4 max-w-[200px] truncate text-slate-800 font-medium">
                      {lead.propertyTitle || 'General Chitral Inquiry'}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={lead.status}
                        onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                        className={`text-[10px] font-bold py-1 px-2 rounded-md border ${statusColors[lead.status].bg} ${statusColors[lead.status].text} ${statusColors[lead.status].border}`}
                      >
                        {statuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3 px-4 max-w-[220px] truncate text-slate-500 text-[11px]">
                      {lead.notes || '—'}
                    </td>

                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {lead.date}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openWhatsApp(lead.phone, lead.name)}
                          className="p-1.5 rounded-lg bg-[#25D366]/15 text-[#128C7E] hover:bg-[#25D366]/30"
                          title="WhatsApp"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <a
                          href={`tel:${lead.phone.replace(/\s+/g, '')}`}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-slate-700"
                          title="Call"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                          title="Delete"
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
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95">
            <div className="bg-[#0f2f45] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand text-lg font-bold">Add Manual Lead</h3>
                <p className="text-xs text-emerald-300">Record phone or walk-in inquiry</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Asadullah Beg"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="0345 5429230"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Interested Property (Title or Area)
                </label>
                <input
                  type="text"
                  value={newPropertyTitle}
                  onChange={(e) => setNewPropertyTitle(e.target.value)}
                  placeholder="e.g. 10 Marla House in Singoor"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Requested site visit on Friday..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2f6b3a] hover:bg-[#25552e] text-white rounded-lg text-xs font-bold shadow-md"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
