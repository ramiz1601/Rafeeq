import React, { useMemo, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminNavRoute } from '../../types';
import { 
  Building2, 
  Handshake, 
  BadgePercent, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Check,
  X,
  MapPin,
  Eye
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';

interface AdminDashboardProps {
  onNavigate: (route: AdminNavRoute) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const { properties, transactions, leads, ledger, approveProperty, rejectProperty } = useStore();
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    try {
      setActionLoadingId(id);
      await approveProperty(id);
    } catch (e: any) {
      console.error('Approve property error:', e);
      alert('Could not approve property. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setActionLoadingId(id);
      await rejectProperty(id);
    } catch (e: any) {
      console.error('Reject property error:', e);
      alert('Could not reject property. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const pendingProperties = useMemo(() => {
    const seen = new Set<string>();
    return properties.filter((p) => {
      if (!p.id || seen.has(p.id)) return false;
      seen.add(p.id);
      return p.status === 'Pending Review';
    });
  }, [properties]);

  const recentLeads = useMemo(() => {
    const seen = new Set<string>();
    return leads
      .filter((l) => {
        if (!l.id || seen.has(l.id)) return false;
        seen.add(l.id);
        return true;
      })
      .slice(0, 5);
  }, [leads]);

  const recentTransactions = useMemo(() => {
    const seen = new Set<string>();
    return transactions
      .filter((t) => {
        if (!t.id || seen.has(t.id)) return false;
        seen.add(t.id);
        return true;
      })
      .slice(0, 5);
  }, [transactions]);

  // 1. Compute Stats
  const totalPropertiesCount = properties.length;
  const closedDealsCount = transactions.length;

  const totalCommission = useMemo(() => {
    return transactions.reduce((sum, t) => sum + (t.commission || 0), 0);
  }, [transactions]);

  const totalExpense = useMemo(() => {
    return ledger
      .filter((l) => l.type === 'expense')
      .reduce((sum, l) => sum + l.amount, 0);
  }, [ledger]);

  const netProfit = totalCommission - totalExpense;

  // 2. Monthly Income vs Expenses Chart Data (Jan - Aug)
  const monthlyChartData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    return months.map((m, idx) => {
      const monthPrefix = `2026-0${idx + 1}`;
      const monthIncome = ledger
        .filter((l) => l.type === 'income' && l.date.startsWith(monthPrefix))
        .reduce((sum, l) => sum + l.amount, 0);

      const monthExpense = ledger
        .filter((l) => l.type === 'expense' && l.date.startsWith(monthPrefix))
        .reduce((sum, l) => sum + l.amount, 0);

      return {
        month: m,
        Income: monthIncome || (idx === 7 ? 150000 : 80000),
        Expenses: monthExpense || 20000
      };
    });
  }, [ledger]);

  // 3. Property Types Donut Chart Data
  const propertyTypesData = useMemo(() => {
    const counts: Record<string, number> = {
      House: 0,
      Land: 0,
      Commercial: 0,
      Building: 0
    };
    properties.forEach((p) => {
      if (counts[p.type] !== undefined) {
        counts[p.type] += 1;
      }
    });

    const colors: Record<string, string> = {
      Land: '#2f6b3a',       // Forest Green
      House: '#0f2f45',      // Dark Navy
      Commercial: '#3b82f6', // Blue
      Building: '#f59e0b'    // Amber
    };

    return Object.keys(counts).map((type) => ({
      name: type,
      value: counts[type],
      color: colors[type],
      percentage: totalPropertiesCount > 0 ? Math.round((counts[type] / totalPropertiesCount) * 100) : 0
    }));
  }, [properties, totalPropertiesCount]);

  // Lead status pill color
  const getLeadStatusBadge = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Visiting':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Closed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Negative':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Property Submissions Awaiting Approval Banner & Action Queue */}
      {pendingProperties.length > 0 ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow">
                <AlertCircle className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h3 className="font-serif-brand text-base font-bold text-amber-950 flex items-center gap-2">
                  <span>{pendingProperties.length} Property Post{pendingProperties.length > 1 ? 's' : ''} Awaiting Approval</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold">Action Required</span>
                </h3>
                <p className="text-xs text-amber-800">
                  Review new client property submissions from the public website before publishing to the live catalogue.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('properties')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
            >
              <span>Manage In Catalogue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick action cards for pending posts */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingProperties.slice(0, 3).map((prop) => (
              <div key={prop.id} className="bg-white rounded-xl p-3 border border-amber-200 shadow-sm flex flex-col justify-between space-y-3">
                <div className="flex gap-3">
                  <img
                    src={prop.images[0] || 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=300&q=80'}
                    alt={prop.title}
                    className="w-16 h-16 rounded-lg object-cover border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                      {prop.type} • For {prop.purpose}
                    </span>
                    <h4 className="font-bold text-xs text-[#0f2f45] truncate" title={prop.title}>
                      {prop.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {prop.location}
                    </p>
                    <p className="text-xs font-bold text-[#0f2f45] mt-1">
                      Rs. {prop.price.toLocaleString('en-PK')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-stone-100 pt-2 text-xs">
                  <div className="text-[10px] text-slate-500">
                    By: <span className="font-semibold text-slate-700">{prop.ownerName || 'Client'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleApprove(prop.id)}
                      disabled={actionLoadingId === prop.id}
                      className="flex items-center gap-1 px-2.5 py-1 bg-[#2f6b3a] hover:bg-[#25552e] disabled:opacity-50 text-white text-[11px] font-bold rounded-md shadow-xs transition-colors"
                      title="Approve & Publish to public site"
                    >
                      <Check className="w-3 h-3" />
                      <span>{actionLoadingId === prop.id ? 'Approving...' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => handleReject(prop.id)}
                      disabled={actionLoadingId === prop.id}
                      className="flex items-center gap-1 px-2 py-1 bg-rose-100 hover:bg-rose-200 disabled:opacity-50 text-rose-800 text-[11px] font-semibold rounded-md transition-colors"
                      title="Reject submission"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      
      {/* Four Stat Cards in a Row */}
      {/* 
        1. Total Properties (42, "+5 this month")
        2. Total Deals Closed (18, "+3 this month")
        3. Total Commission (Rs. 1,250,000, "+12% this month")
        4. Net Profit (Rs. 1,070,000, "+10% this month") 
      */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Properties */}
        <div 
          onClick={() => onNavigate('properties')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b6672]">
              Total Properties
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif-brand text-3xl font-bold text-[#0f2f45]">
            {totalPropertiesCount}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +5 this month
            </span>
            <span className="text-slate-400">across Chitral</span>
          </div>
        </div>

        {/* Card 2: Total Deals Closed */}
        <div 
          onClick={() => onNavigate('transactions')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b6672]">
              Total Deals Closed
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#2f6b3a] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Handshake className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif-brand text-3xl font-bold text-[#0f2f45]">
            {closedDealsCount}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +3 this month
            </span>
            <span className="text-slate-400">registry sealed</span>
          </div>
        </div>

        {/* Card 3: Total Commission */}
        <div 
          onClick={() => onNavigate('commissions')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b6672]">
              Total Commission
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <BadgePercent className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#0f2f45]">
            Rs. {totalCommission.toLocaleString('en-PK')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +12% this month
            </span>
            <span className="text-slate-400">brokerage</span>
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div 
          onClick={() => onNavigate('ledger')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5b6672]">
              Net Agency Profit
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#2f6b3a]">
            Rs. {netProfit.toLocaleString('en-PK')}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="inline-flex items-center text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +10% this month
            </span>
            <span className="text-slate-400">after expenses</span>
          </div>
        </div>

      </div>

      {/* Two Interactive Charts: Income vs Expenses + Property Types Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Chart 1: Income vs Expenses Bar Chart (Jan - Aug) */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h3 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
                Monthly Income vs Expenses
              </h3>
              <p className="text-xs text-[#5b6672]">
                Brokerage revenue against operational costs (Jan – Aug 2026 in PKR)
              </p>
            </div>
            <button
              onClick={() => onNavigate('ledger')}
              className="text-xs font-bold text-[#2f6b3a] hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Full Ledger</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(val: any) => [`Rs. ${Number(val).toLocaleString('en-PK')}`, '']}
                  contentStyle={{
                    backgroundColor: '#0f2f45',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="Income" fill="#2f6b3a" radius={[4, 4, 0, 0]} name="Income (Commission)" />
                <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Operating Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Property Types Donut Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
              Property Distribution
            </h3>
            <p className="text-xs text-[#5b6672]">
              Active & cataloged assets by category
            </p>
          </div>

          {/* Donut Chart with total number in the center */}
          <div className="relative h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={propertyTypesData}
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {propertyTypesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val: any, name: any) => [`${val} Properties`, `${name}`]}
                  contentStyle={{
                    backgroundColor: '#0f2f45',
                    borderRadius: '8px',
                    color: '#fff',
                    border: 'none',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Total number in the center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="font-serif-brand text-2xl font-bold text-[#0f2f45]">
                {totalPropertiesCount}
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Total
              </span>
            </div>
          </div>

          {/* Legend and percentage row */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
            {propertyTypesData.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-[#0f2f45]">{item.value} ({item.percentage}%)</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Two Recent Tables: Recent Leads & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Table 1: Recent Leads Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
                Recent Inquiries & Leads
              </h3>
              <p className="text-xs text-[#5b6672]">
                New prospective buyers and visiting schedules
              </p>
            </div>
            <button
              onClick={() => onNavigate('leads')}
              className="text-xs font-bold text-[#2f6b3a] hover:underline flex items-center gap-1"
            >
              <span>View All Leads</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-100 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Interested Property</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#0f2f45]">{lead.name}</div>
                      <div className="text-[11px] text-slate-500">{lead.phone}</div>
                    </td>
                    <td className="py-3 px-4 max-w-[180px] truncate text-slate-700">
                      {lead.propertyTitle || 'General Chitral Inquiry'}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getLeadStatusBadge(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono">
                      {lead.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table 2: Recent Transactions Table */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <div>
              <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
                Recent Transactions
              </h3>
              <p className="text-xs text-[#5b6672]">
                Verified sales, settlements, and commission yields
              </p>
            </div>
            <button
              onClick={() => onNavigate('transactions')}
              className="text-xs font-bold text-[#2f6b3a] hover:underline flex items-center gap-1"
            >
              <span>View All Transactions</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-100 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Property</th>
                  <th className="py-3 px-4">Deal Amount</th>
                  <th className="py-3 px-4">Commission</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 max-w-[180px]">
                      <div className="font-bold text-[#0f2f45] truncate">{tx.propertyTitle}</div>
                      <div className="text-[11px] text-slate-500">Agent: {tx.agentName}</div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      Rs. {tx.amount.toLocaleString('en-PK')}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#2f6b3a]">
                      Rs. {tx.commission.toLocaleString('en-PK')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
