import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useStore } from '../../context/StoreContext';
import { AdminNavRoute } from '../../types';
import { 
  LayoutDashboard, 
  Building2, 
  Users2, 
  UserCheck, 
  Target, 
  MessageSquareText, 
  Receipt, 
  BadgePercent, 
  WalletCards, 
  BarChart3, 
  Settings, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X,
  Bell,
  Plus
} from 'lucide-react';

interface AdminLayoutProps {
  currentRoute: AdminNavRoute;
  onNavigate: (route: AdminNavRoute) => void;
  onReturnToPublic: () => void;
  children: React.ReactNode;
  onOpenAddPropertyModal?: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRoute,
  onNavigate,
  onReturnToPublic,
  children,
  onOpenAddPropertyModal
}) => {
  const { properties, leads, activeAdminUser, logoutAdmin, settings } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Pending submissions count
  const pendingCount = properties.filter((p) => p.status === 'Pending Review').length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;

  const navItems: { id: AdminNavRoute; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2, badge: pendingCount },
    { id: 'sellers', label: 'Sellers', icon: Users2 },
    { id: 'buyers', label: 'Buyers', icon: UserCheck },
    { id: 'leads', label: 'Leads & Inquiries', icon: Target, badge: newLeadsCount },
    { id: 'transactions', label: 'Transactions', icon: Receipt },
    { id: 'commissions', label: 'Commissions', icon: BadgePercent },
    { id: 'ledger', label: 'Income & Expenses', icon: WalletCards },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const currentDateFormatted = new Date().toLocaleDateString('en-PK', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const pageTitles: Record<AdminNavRoute, string> = {
    dashboard: 'Executive Dashboard & Metrics',
    properties: 'Property Listings Management',
    sellers: 'Property Sellers & Landlords',
    buyers: 'Registered Buyers & Investors',
    leads: 'Leads & Client Inquiries Pipeline',
    transactions: 'Closed Deals & Transactions',
    commissions: 'Brokerage & Agent Commissions',
    ledger: 'Income & Expenses Ledger',
    reports: 'Business Performance Reports',
    settings: 'Agency Configuration & Settings'
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex flex-col md:flex-row">
      
      {/* 1. Left Sidebar (Dark Navy: #0f2f45) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0f2f45] text-white border-r border-[#0a202f] shrink-0 sticky top-0 h-screen z-30 justify-between">
        
        {/* Top brand header */}
        <div className="p-5 border-b border-white/10">
          <div className="cursor-pointer" onClick={onReturnToPublic}>
            <BrandLogo variant="light" size="sm" showWordmark={true} />
          </div>
          <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
            <span>Admin Management Suite</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#2f6b3a] text-white shadow-md'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-[#2f6b3a]' : 'bg-amber-500 text-black'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions: View Site & Logout */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0a202f]">
          <button
            onClick={onReturnToPublic}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span>View Public Website</span>
            </span>
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded">Live</span>
          </button>

          <button
            onClick={logoutAdmin}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Administrator</span>
          </button>
        </div>

      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0f2f45] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <BrandLogo variant="light" size="sm" />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg hover:bg-white/10"
          >
            {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex">
          <div className="w-72 bg-[#0f2f45] text-white p-5 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <BrandLogo variant="light" size="sm" />
                <button onClick={() => setMobileSidebarOpen(false)}>
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentRoute === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold ${
                        isActive ? 'bg-[#2f6b3a] text-white' : 'text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-emerald-400" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-black">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <button
                onClick={() => {
                  onReturnToPublic();
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2 text-xs py-2 text-slate-300"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Return to Public Website</span>
              </button>
              <button
                onClick={() => {
                  logoutAdmin();
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2 text-xs py-2 text-rose-400 font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)} />
        </div>
      )}

      {/* 2. Main Content Body */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        {/* "Top bar: page title, "Welcome back, [Admin Name]!" greeting with today's date, small profile avatar/name on the right." */}
        <header className="bg-white border-b border-stone-200/80 px-6 py-4 sticky top-0 z-20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif-brand text-xl sm:text-2xl font-bold text-[#0f2f45]">
              {pageTitles[currentRoute]}
            </h1>
            <p className="text-xs text-[#5b6672]">
              Welcome back, <span className="font-semibold text-slate-900">{activeAdminUser.name}</span>! — {currentDateFormatted}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Action Button */}
            {onOpenAddPropertyModal && (
              <button
                onClick={onOpenAddPropertyModal}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Property</span>
              </button>
            )}

            {/* Notification Indicator */}
            <div className="relative p-2 rounded-full hover:bg-stone-100 text-slate-600 cursor-pointer">
              <Bell className="w-4 h-4" />
              {(pendingCount > 0 || newLeadsCount > 0) && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              )}
            </div>

            {/* Small Profile Avatar / Name on Right */}
            <div className="flex items-center gap-3 pl-3 border-l border-stone-200">
              <div className="w-9 h-9 rounded-full bg-[#0f2f45] text-white flex items-center justify-center font-bold text-xs shadow-sm font-serif-brand">
                RA
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-[#0f2f45] leading-tight">
                  {activeAdminUser.name}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold">
                  Managing Director
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </main>

      </div>

    </div>
  );
};
