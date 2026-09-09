import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Person } from '../../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Phone, 
  Mail, 
  Building, 
  Calendar, 
  X, 
  UserCheck, 
  Users2,
  FileText
} from 'lucide-react';

interface AdminPeopleProps {
  role: 'Seller' | 'Buyer';
}

export const AdminPeople: React.FC<AdminPeopleProps> = ({ role }) => {
  const { people, addPerson, updatePerson, deletePerson } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [propertyInterest, setPropertyInterest] = useState('');
  const [notes, setNotes] = useState('');

  const rolePeople = useMemo(() => {
    const seen = new Set<string>();
    return people.filter((p) => {
      if (!p.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return p.role === role || p.type === role.toLowerCase();
    });
  }, [people, role]);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return rolePeople;
    const q = searchQuery.toLowerCase();
    return rolePeople.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.phone.toLowerCase().includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.propertyInterest && p.propertyInterest.toLowerCase().includes(q))
    );
  }, [rolePeople, searchQuery]);

  const handleOpenAdd = () => {
    setEditingPerson(null);
    setName('');
    setPhone('');
    setEmail('');
    setPropertyInterest('');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (person: Person) => {
    setEditingPerson(person);
    setName(person.name);
    setPhone(person.phone);
    setEmail(person.email || '');
    setPropertyInterest(person.propertyInterest || '');
    setNotes(person.notes || '');
    setIsModalOpen(true);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || '',
          propertyInterest: propertyInterest.trim() || '',
          notes: notes.trim() || ''
        });
      } else {
        await addPerson({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || '',
          type: role.toLowerCase() as 'seller' | 'buyer',
          role,
          propertyInterest: propertyInterest.trim() || '',
          notes: notes.trim() || ''
        });
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save person:', err);
      alert('Could not save record to database. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isSeller = role === 'Seller';

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
            isSeller ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {isSeller ? <Users2 className="w-5 h-5" /> : <UserCheck className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
              {isSeller ? 'Property Sellers & Landowners' : 'Registered Buyers & Investors'} ({rolePeople.length})
            </h2>
            <p className="text-xs text-[#5b6672]">
              {isSeller 
                ? 'Directory of title deed owners, landlords, and commercial plot holders' 
                : 'Active verified investors seeking land, commercial plots, and homes in Chitral'}
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New {role}</span>
        </button>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${role.toLowerCase()}s by name, phone, email, or property...`}
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">{isSeller ? 'Associated Property' : 'Property Interest / Budget'}</th>
                <th className="py-3 px-4">Notes</th>
                <th className="py-3 px-4">Date Added</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((person) => (
                <tr key={person.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#0f2f45]">{person.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">ID: {person.id.toUpperCase()}</div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <a
                      href={`tel:${person.phone.replace(/\s+/g, '')}`}
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:text-[#2f6b3a] font-medium"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{person.phone}</span>
                    </a>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {person.email ? (
                      <span className="truncate max-w-[150px] inline-block">{person.email}</span>
                    ) : (
                      <span className="text-slate-300 italic">None</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-slate-800 font-medium max-w-[200px] truncate">
                    {person.propertyInterest || 'Chitral Real Estate'}
                  </td>

                  <td className="py-3 px-4 text-slate-500 text-[11px] max-w-[220px] truncate">
                    {person.notes || '—'}
                  </td>

                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {person.dateAdded}
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(person)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-slate-700 transition-colors"
                        title="Edit Record"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete record for ${person.name}?`)) {
                            deletePerson(person.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete Record"
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

      {/* Add / Edit Person Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95">
            
            <div className="bg-[#0f2f45] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand text-lg font-bold">
                  {editingPerson ? `Edit ${role}` : `Add New ${role}`}
                </h3>
                <p className="text-xs text-emerald-300">
                  Client Relationship Record
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Haji Ghulam Rasool"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Phone Number / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0345 5429230"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@gmail.com"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  {isSeller ? 'Associated Property Title / Area' : 'Interested Property Type or Budget'}
                </label>
                <input
                  type="text"
                  value={propertyInterest}
                  onChange={(e) => setPropertyInterest(e.target.value)}
                  placeholder={isSeller ? "e.g. 10 Marla Singoor House" : "e.g. 1 Kanal commercial plot in Drosh / Budget 2 Crore"}
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Meeting details, revenue record status, preferred payment schedules..."
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
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
                  {editingPerson ? 'Save Changes' : `Add ${role}`}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
