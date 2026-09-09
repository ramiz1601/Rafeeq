import React, { useState } from 'react';
import { BrandLogo } from '../common/BrandLogo';
import { useStore } from '../../context/StoreContext';
import { Lock, Mail, ShieldCheck, ArrowRight, X } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin, settings } = useStore();
  const [email, setEmail] = useState('admin@rafeeqhomes.com');
  const [password, setPassword] = useState('chitral2026');

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAdmin(email, password);
    onSuccess();
  };

  const handleQuickDemoLogin = () => {
    loginAdmin('director@rafeeqhomes.com', 'admin');
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Navy Header */}
        <div className="bg-[#0f2f45] p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex justify-center mb-3">
            <BrandLogo variant="light" size="sm" showTagline={false} />
          </div>
          <h3 className="font-serif-brand text-xl font-bold">
            Staff & Admin Portal
          </h3>
          <p className="text-xs text-emerald-300 mt-1">
            Rafeeq Homes and Properties (PVT LTD)
          </p>
        </div>

        {/* Body Form */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#0f2f45] block">Quick 1-Click Access:</span>
              <span className="text-emerald-800">Pre-authenticated demo mode</span>
            </div>
            <button
              onClick={handleQuickDemoLogin}
              className="px-3 py-1.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white font-bold text-xs shrink-0 shadow-sm"
            >
              Enter Dashboard
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Protected Agency Session</span>
              </span>
              <span className="italic text-[11px]">Any password works</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0f2f45] hover:bg-[#174363] text-white font-serif-brand font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In to Admin Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
