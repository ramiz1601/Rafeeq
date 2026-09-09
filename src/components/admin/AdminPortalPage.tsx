import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminNavRoute } from '../../types';
import { BrandLogo } from '../common/BrandLogo';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminProperties } from './AdminProperties';
import { AdminPeople } from './AdminPeople';
import { AdminLeads } from './AdminLeads';
import { AdminTransactions } from './AdminTransactions';
import { AdminCommissions } from './AdminCommissions';
import { AdminLedger } from './AdminLedger';
import { AdminReports } from './AdminReports';
import { AdminSettings } from './AdminSettings';
import { 
  ShieldCheck, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle, 
  KeyRound, 
  Database,
  ExternalLink 
} from 'lucide-react';

interface AdminPortalPageProps {
  onReturnToPublic: () => void;
  onViewPropertyDetails?: (propertyId: string) => void;
}

export const AdminPortalPage: React.FC<AdminPortalPageProps> = ({
  onReturnToPublic,
  onViewPropertyDetails
}) => {
  const { 
    isAdminAuthenticated, 
    loginAdminWithGoogle, 
    loginAdminWithPasscode, 
    logoutAdmin,
    settings,
    activeAdminUser,
    properties
  } = useStore();

  const [currentRoute, setCurrentRoute] = useState<AdminNavRoute>('dashboard');
  const [passcode, setPasscode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAdminAddPropertyOpen, setIsAdminAddPropertyOpen] = useState(false);

  // Sync route on hash changes if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#admin/')) {
        const subRoute = hash.replace('#admin/', '') as AdminNavRoute;
        setCurrentRoute(subRoute);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleNavigate = (route: AdminNavRoute) => {
    setCurrentRoute(route);
    window.location.hash = `#admin/${route}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePasscodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!passcode.trim()) {
      setErrorMsg('Please enter your agency administrator passcode.');
      return;
    }
    const success = loginAdminWithPasscode(passcode.trim());
    if (!success) {
      setErrorMsg('Invalid administrative passcode. Please verify or use Google Sign-in.');
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const ok = await loginAdminWithGoogle();
      if (!ok) {
        setErrorMsg('Sign-in cancelled or unauthorized. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. If NOT authenticated, render standalone Admin Login Portal Gateway
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0a1e2d] text-slate-100 flex flex-col justify-between selection:bg-[#2f6b3a] selection:text-white">
        {/* Top Header */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandLogo variant="light" size="sm" showTagline={false} />
            <span className="hidden sm:inline-block text-xs uppercase tracking-widest text-emerald-400 font-semibold border-l border-white/20 pl-3">
              Management Portal
            </span>
          </div>

          <button
            onClick={onReturnToPublic}
            className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 px-3 py-2 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Website</span>
          </button>
        </header>

        {/* Center Portal Gateway Card */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-[#0f2f45] border border-white/15 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-[#2f6b3a] text-white flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h1 className="font-serif-brand text-2xl font-bold text-white tracking-wide">
                Agency Owner Portal
              </h1>
              <p className="text-xs text-slate-300">
                Authorized administrative access for {settings.companyName || 'Rafeeq Homes and Properties'}.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-900/40 border border-rose-500/50 rounded-xl text-rose-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Google Authentication Option */}
            <div className="space-y-3">
              <button
                onClick={handleGoogleSignIn}
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{isSubmitting ? 'Authenticating...' : 'Sign In with Authorized Google Account'}</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400 my-4">
              <div className="flex-1 h-px bg-white/10" />
              <span>OR OWNER PASSCODE</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Passcode Form */}
            <form onSubmit={handlePasscodeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Owner Passcode
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter owner PIN/passcode"
                    className="w-full pl-9 pr-3 py-2.5 bg-black/30 border border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default owner passcode: <span className="font-mono text-emerald-400 font-bold">admin786</span>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white font-bold text-xs shadow-md transition-all"
              >
                Access Agency CRM & Approvals
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <Database className="w-3 h-3" /> Live Firestore Connected
              </span>
              <span>KPK SECP Compliant</span>
            </div>

          </div>
        </main>

        {/* Footer */}
        <footer className="py-4 text-center text-xs text-slate-500 border-t border-white/5">
          © {new Date().getFullYear()} {settings.companyName || 'Rafeeq Homes and Properties (PVT LTD)'} • Chitral Administrative Portal
        </footer>
      </div>
    );
  }

  // 2. If authenticated, render full dedicated Admin Portal Suite
  return (
    <AdminLayout
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      onReturnToPublic={onReturnToPublic}
      onOpenAddPropertyModal={() => setIsAdminAddPropertyOpen(true)}
    >
      {currentRoute === 'dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
      {currentRoute === 'properties' && (
        <AdminProperties
          isModalOpenExternal={isAdminAddPropertyOpen}
          onCloseExternalModal={() => setIsAdminAddPropertyOpen(false)}
          onViewPropertyDetails={onViewPropertyDetails}
        />
      )}
      {currentRoute === 'sellers' && <AdminPeople role="Seller" />}
      {currentRoute === 'buyers' && <AdminPeople role="Buyer" />}
      {currentRoute === 'leads' && <AdminLeads />}
      {currentRoute === 'transactions' && <AdminTransactions />}
      {currentRoute === 'commissions' && <AdminCommissions />}
      {currentRoute === 'ledger' && <AdminLedger />}
      {currentRoute === 'reports' && <AdminReports />}
      {currentRoute === 'settings' && <AdminSettings />}
    </AdminLayout>
  );
};
