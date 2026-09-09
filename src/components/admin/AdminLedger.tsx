import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { LedgerEntry } from '../../types';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  WalletCards, 
  Search, 
  Calendar, 
  Trash2,
  Filter,
  DollarSign
} from 'lucide-react';

export const AdminLedger: React.FC = () => {
  const { ledger, addLedgerEntry, deleteLedgerEntry } = useStore();

  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Commission');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [amount, setAmount] = useState<number | ''>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Form Submission
  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    addLedgerEntry({
      date,
      description,
      category,
      type,
      amount: Number(amount)
    });

    setDescription('');
    setAmount('');
  };

  // Compute Running Totals
  const sortedLedger = useMemo(() => {
    const seen = new Set<string>();
    const uniqueLedger = ledger.filter((l) => {
      if (!l.id || seen.has(l.id)) return false;
      seen.add(l.id);
      return true;
    });
    // Sort oldest to newest to compute correct running balance
    const sorted = [...uniqueLedger].sort((a, b) => a.date.localeCompare(b.date));
    let running = 0;
    return sorted.map((entry) => {
      if (entry.type === 'income') {
        running += entry.amount;
      } else {
        running -= entry.amount;
      }
      return {
        ...entry,
        runningBalance: running
      };
    }).reverse(); // display newest first in table
  }, [ledger]);

  const filteredEntries = sortedLedger.filter((entry) => {
    if (filterType !== 'all' && entry.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.date.includes(q)
      );
    }
    return true;
  });

  const totalIncome = ledger
    .filter((l) => l.type === 'income')
    .reduce((sum, l) => sum + l.amount, 0);

  const totalExpense = ledger
    .filter((l) => l.type === 'expense')
    .reduce((sum, l) => sum + l.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  return (
    <div className="space-y-6">
      
      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Total Revenue Inflows
            </span>
            <div className="font-serif-brand text-2xl font-bold text-[#2f6b3a] mt-1">
              Rs. {totalIncome.toLocaleString('en-PK')}
            </div>
            <span className="text-[11px] text-slate-400">All commissions & fees</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#2f6b3a] flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Total Expenses Outflows
            </span>
            <div className="font-serif-brand text-2xl font-bold text-rose-600 mt-1">
              Rs. {totalExpense.toLocaleString('en-PK')}
            </div>
            <span className="text-[11px] text-slate-400">Office, marketing & travel</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <ArrowDownRight className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
              Net Agency Reserve
            </span>
            <div className="font-serif-brand text-2xl font-bold text-[#0f2f45] mt-1">
              Rs. {currentBalance.toLocaleString('en-PK')}
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold">Verified Treasury Balance</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0f2f45] flex items-center justify-center">
            <WalletCards className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Add-Entry Form at the Top */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-4">
        <div>
          <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
            Add Ledger Transaction Entry
          </h3>
          <p className="text-xs text-[#5b6672]">
            Record cash receipts, revenue stamp costs, vehicle fuel, or agency commission
          </p>
        </div>

        <form onSubmit={handleAddEntry} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {/* Date */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
              Entry Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold"
            >
              <option value="income">Income (+ Credit)</option>
              <option value="expense">Expense (- Debit)</option>
            </select>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
            >
              <option value="Commission">Commission</option>
              <option value="Documentation">Documentation / Registry</option>
              <option value="Marketing">Marketing & Advertising</option>
              <option value="Office Rent">Office Rent / Utilities</option>
              <option value="Travel / Fuel">Travel & Site Vehicles</option>
              <option value="Legal Fees">Legal & Patwari Arbitration</option>
              <option value="Miscellaneous">Miscellaneous</option>
            </select>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
              Amount (PKR)
            </label>
            <input
              type="number"
              required
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="e.g. 50000"
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-bold"
            />
          </div>

          {/* Description */}
          <div className="lg:col-span-2">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
              Description / Voucher Details
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Client commission on Drosh plot sale"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold rounded-lg shrink-0 shadow-sm"
              >
                Record Entry
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries by description, category, or date..."
            className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                filterType === t
                  ? 'bg-[#0f2f45] text-white'
                  : 'bg-stone-100 text-slate-600 hover:bg-stone-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Description</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Amount (PKR)</th>
                <th className="py-3 px-4 text-right">Running Balance</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredEntries.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {item.date}
                  </td>

                  <td className="py-3 px-4 font-semibold text-[#0f2f45] max-w-[280px]">
                    {item.description}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-stone-100 text-slate-700 text-[10px] font-medium border border-stone-200">
                      {item.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1 font-bold text-[11px] ${
                      item.type === 'income' ? 'text-[#2f6b3a]' : 'text-rose-600'
                    }`}>
                      {item.type === 'income' ? '+' : '-'} {item.type.toUpperCase()}
                    </span>
                  </td>

                  <td className={`py-3 px-4 text-right font-bold font-mono whitespace-nowrap ${
                    item.type === 'income' ? 'text-[#2f6b3a]' : 'text-rose-600'
                  }`}>
                    Rs. {item.amount.toLocaleString('en-PK')}
                  </td>

                  <td className="py-3 px-4 text-right font-mono font-bold text-[#0f2f45] whitespace-nowrap">
                    Rs. {item.runningBalance.toLocaleString('en-PK')}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => {
                        if (confirm(`Remove entry: "${item.description}"?`)) {
                          deleteLedgerEntry(item.id);
                        }
                      }}
                      className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
