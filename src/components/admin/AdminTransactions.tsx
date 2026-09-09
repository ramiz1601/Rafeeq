import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Transaction } from '../../types';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  Receipt, 
  Download, 
  DollarSign, 
  X,
  BadgePercent
} from 'lucide-react';

export const AdminTransactions: React.FC = () => {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  // Form State
  const [propertyTitle, setPropertyTitle] = useState('');
  const [buyerName, setBuyerName] = useState('');
  const [sellerName, setSellerName] = useState('');
  const [amount, setAmount] = useState<number>(18000000);
  const [commissionPercent, setCommissionPercent] = useState<number>(2);
  const [status, setStatus] = useState<'Paid' | 'Pending'>('Paid');
  const [agentName, setAgentName] = useState('Rafeeq Ahmad');

  const filtered = useMemo(() => {
    const seen = new Set<string>();
    return transactions.filter((tx) => {
      if (!tx.id || seen.has(tx.id)) return false;
      seen.add(tx.id);
      if (filterStatus !== 'All' && tx.status !== filterStatus) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          tx.propertyTitle.toLowerCase().includes(q) ||
          tx.buyerName.toLowerCase().includes(q) ||
          tx.sellerName.toLowerCase().includes(q) ||
          tx.agentName.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, filterStatus, searchQuery]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setPropertyTitle('');
    setBuyerName('');
    setSellerName('');
    setAmount(15000000);
    setCommissionPercent(2);
    setStatus('Paid');
    setAgentName('Rafeeq Ahmad');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setEditingTransaction(tx);
    setPropertyTitle(tx.propertyTitle);
    setBuyerName(tx.buyerName);
    setSellerName(tx.sellerName);
    setAmount(tx.amount);
    setCommissionPercent(tx.commissionPercent);
    setStatus(tx.status);
    setAgentName(tx.agentName);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propertyTitle.trim() || !amount) return;

    const computedCommission = Math.round((Number(amount) * Number(commissionPercent)) / 100);

    if (editingTransaction) {
      updateTransaction(editingTransaction.id, {
        propertyTitle,
        buyerName,
        sellerName,
        amount: Number(amount),
        commission: computedCommission,
        commissionPercent: Number(commissionPercent),
        status,
        agentName
      });
    } else {
      addTransaction({
        propertyTitle,
        buyerName,
        sellerName,
        amount: Number(amount),
        commission: computedCommission,
        commissionPercent: Number(commissionPercent),
        status,
        agentName
      });
    }

    setIsModalOpen(false);
  };

  const totalVolume = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalCommission = transactions.reduce((sum, t) => sum + t.commission, 0);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
        <div>
          <h2 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
            Closed Deals & Transactions ({transactions.length})
          </h2>
          <p className="text-xs text-[#5b6672]">
            Total Gross Deal Volume: <span className="font-bold text-[#0f2f45]">Rs. {totalVolume.toLocaleString('en-PK')}</span> | Commission Earned: <span className="font-bold text-[#2f6b3a]">Rs. {totalCommission.toLocaleString('en-PK')}</span>
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold shadow-md transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Record New Deal</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals by property title, buyer, seller, or agent..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-slate-700"
        >
          <option value="All">All Payment Statuses</option>
          <option value="Paid">Paid Only</option>
          <option value="Pending">Pending Only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Deal Ref & Date</th>
                <th className="py-3 px-4">Property</th>
                <th className="py-3 px-4">Buyer & Seller</th>
                <th className="py-3 px-4">Sale Amount</th>
                <th className="py-3 px-4">Commission (%)</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-700 block">{tx.id.toUpperCase()}</span>
                    <span className="text-[10px] text-slate-400">{tx.date}</span>
                  </td>

                  <td className="py-3 px-4 max-w-[200px]">
                    <div className="font-bold text-[#0f2f45] truncate" title={tx.propertyTitle}>
                      {tx.propertyTitle}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-[11px]">
                    <div><span className="text-slate-400">Buyer:</span> <span className="font-semibold text-slate-800">{tx.buyerName}</span></div>
                    <div><span className="text-slate-400">Seller:</span> <span className="text-slate-600">{tx.sellerName}</span></div>
                  </td>

                  <td className="py-3 px-4 font-bold text-[#0f2f45] whitespace-nowrap">
                    Rs. {tx.amount.toLocaleString('en-PK')}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-[#2f6b3a]">
                      Rs. {tx.commission.toLocaleString('en-PK')}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      ({tx.commissionPercent}%)
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium whitespace-nowrap">
                    {tx.agentName}
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      tx.status === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}>
                      {tx.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(tx)}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-slate-700"
                        title="Edit Transaction"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Delete this transaction?')) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 rounded-lg border border-stone-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600"
                        title="Delete Transaction"
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

      {/* Add / Edit Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 animate-in zoom-in-95">
            <div className="bg-[#0f2f45] p-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-serif-brand text-lg font-bold">
                  {editingTransaction ? 'Edit Closed Deal' : 'Record Deal Settlement'}
                </h3>
                <p className="text-xs text-emerald-300">Commission & Registry Record</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                  Property Title *
                </label>
                <input
                  type="text"
                  required
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  placeholder="e.g. 10 Marla Singoor Residential House"
                  className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Buyer Name
                  </label>
                  <input
                    type="text"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g. Tariq Mehmood"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Seller Name
                  </label>
                  <input
                    type="text"
                    required
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    placeholder="e.g. Haji Ghulam"
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Sale Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Commission (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    value={commissionPercent}
                    onChange={(e) => setCommissionPercent(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex justify-between items-center">
                <span>Computed Brokerage Yield:</span>
                <span className="font-bold text-sm text-[#2f6b3a]">
                  Rs. {Math.round((amount * commissionPercent) / 100).toLocaleString('en-PK')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Commission Payment
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-stone-50"
                  >
                    <option value="Paid">Paid / Received</option>
                    <option value="Pending">Pending Clearance</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                    Closing Agent
                  </label>
                  <select
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full px-3 py-2 border border-stone-300 rounded-lg text-xs bg-stone-50"
                  >
                    <option value="Rafeeq Ahmad">Rafeeq Ahmad</option>
                    <option value="Junaid Chitrali">Junaid Chitrali</option>
                    <option value="Farhan Ali">Farhan Ali</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 rounded-lg text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#2f6b3a] hover:bg-[#25552e] text-white rounded-lg text-xs font-bold shadow-md"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
