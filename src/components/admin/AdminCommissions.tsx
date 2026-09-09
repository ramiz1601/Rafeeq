import React, { useMemo, useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  BadgePercent, 
  Users, 
  TrendingUp, 
  Calendar, 
  Download,
  Award,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export const AdminCommissions: React.FC = () => {
  const { transactions } = useStore();
  const [selectedAgent, setSelectedAgent] = useState<string>('All');

  // Calculate earnings per agent
  const agentBreakdown = useMemo(() => {
    const map: Record<string, { deals: number; volume: number; commission: number; paidCommission: number }> = {};

    transactions.forEach((tx) => {
      const agent = tx.agentName || 'Unassigned';
      if (!map[agent]) {
        map[agent] = { deals: 0, volume: 0, commission: 0, paidCommission: 0 };
      }
      map[agent].deals += 1;
      map[agent].volume += tx.amount;
      map[agent].commission += tx.commission;
      if (tx.status === 'Paid') {
        map[agent].paidCommission += tx.commission;
      }
    });

    return Object.keys(map).map((agent) => ({
      agent,
      deals: map[agent].deals,
      volume: map[agent].volume,
      commission: map[agent].commission,
      paidCommission: map[agent].paidCommission,
      pendingCommission: map[agent].commission - map[agent].paidCommission
    }));
  }, [transactions]);

  // Chart data for agent commission performance
  const chartData = useMemo(() => {
    return agentBreakdown.map((item) => ({
      name: item.agent.split(' ')[0], // first name for chart axis
      fullName: item.agent,
      Commission: item.commission,
      Paid: item.paidCommission
    }));
  }, [agentBreakdown]);

  const totalCommissionEarned = agentBreakdown.reduce((sum, a) => sum + a.commission, 0);
  const totalPaidCommission = agentBreakdown.reduce((sum, a) => sum + a.paidCommission, 0);

  return (
    <div className="space-y-6">
      
      {/* Header Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Gross Agency Commission
          </span>
          <div className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#0f2f45] mt-1">
            Rs. {totalCommissionEarned.toLocaleString('en-PK')}
          </div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            Across {transactions.length} closed real estate sales
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Settled / Paid to Date
          </span>
          <div className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#2f6b3a] mt-1">
            Rs. {totalPaidCommission.toLocaleString('en-PK')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cleared into agency revenue accounts
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Outstanding Clearance
          </span>
          <div className="font-serif-brand text-2xl sm:text-3xl font-bold text-amber-600 mt-1">
            Rs. {(totalCommissionEarned - totalPaidCommission).toLocaleString('en-PK')}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Pending final Registry execution
          </p>
        </div>
      </div>

      {/* Bar Chart: Commission per Agent */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
            Agent Commission Performance
          </h3>
          <p className="text-xs text-[#5b6672]">
            Total commission generated and verified payouts per consultant
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
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
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="Commission" fill="#0f2f45" radius={[4, 4, 0, 0]} name="Total Generated (PKR)" />
              <Bar dataKey="Paid" fill="#2f6b3a" radius={[4, 4, 0, 0]} name="Settled Payouts (PKR)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Commission Breakdown Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex items-center justify-between">
          <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
            Detailed Consultant Commission Breakdown
          </h3>
          <span className="text-xs text-slate-500 font-semibold">
            {agentBreakdown.length} Lead Consultants
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-stone-50 text-slate-500 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Agent Name</th>
                <th className="py-3 px-4">Deals Closed</th>
                <th className="py-3 px-4">Total Sales Volume</th>
                <th className="py-3 px-4">Total Commission</th>
                <th className="py-3 px-4">Settled Amount</th>
                <th className="py-3 px-4 text-right">Pending Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {agentBreakdown.map((row) => (
                <tr key={row.agent} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-[#0f2f45]">
                    {row.agent}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-700">
                    {row.deals} deals
                  </td>
                  <td className="py-3 px-4 text-slate-600 font-mono">
                    Rs. {row.volume.toLocaleString('en-PK')}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#2f6b3a] font-mono">
                    Rs. {row.commission.toLocaleString('en-PK')}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-700 font-mono">
                    Rs. {row.paidCommission.toLocaleString('en-PK')}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-amber-700">
                    Rs. {row.pendingCommission.toLocaleString('en-PK')}
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
