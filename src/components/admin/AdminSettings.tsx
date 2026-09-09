import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Save, 
  CheckCircle2, 
  Building, 
  Lock, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  User, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const { settings, updateSettings, activeAdminUser } = useStore();

  // Profile Settings
  const [adminName, setAdminName] = useState(activeAdminUser.name);
  const [adminEmail, setAdminEmail] = useState(activeAdminUser.email);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Site Content Settings
  const [companyName, setCompanyName] = useState(settings.companyName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [secondaryTagline, setSecondaryTagline] = useState(settings.secondaryTagline);
  const [phone, setPhone] = useState(settings.phone);
  const [whatsapp, setWhatsapp] = useState(settings.whatsapp);
  const [email, setEmail] = useState(settings.email);
  const [address, setAddress] = useState(settings.address);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    updateSettings({
      companyName,
      tagline,
      secondaryTagline,
      phone,
      whatsapp,
      email,
      address
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="font-serif-brand text-lg font-bold text-[#0f2f45]">
            Agency Profile & Platform Settings
          </h2>
          <p className="text-xs text-[#5b6672]">
            Configure site-wide contact info, admin credentials, and corporate details.
          </p>
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* Section 1: Admin Profile Settings */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <User className="w-5 h-5 text-[#2f6b3a]" />
            <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
              Administrator Profile & Security
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Admin Full Name
              </label>
              <input
                type="text"
                required
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Admin Account Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                New Password (Optional)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep unchanged"
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Site Content Settings */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <Building className="w-5 h-5 text-[#0f2f45]" />
            <h3 className="font-serif-brand text-base font-bold text-[#0f2f45]">
              Public Website Branding & Contact Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Primary Brand Tagline
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Secondary Regional Tagline
              </label>
              <input
                type="text"
                value={secondaryTagline}
                onChange={(e) => setSecondaryTagline(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Official Agency Phone
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Official WhatsApp Number (wa.me format)
              </label>
              <input
                type="text"
                required
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Customer Support Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Operating District & Province
              </label>
              <input
                type="text"
                readOnly
                value="Lower Chitral, Khyber Pakhtunkhwa, Pakistan"
                className="w-full px-3.5 py-2 border border-stone-200 rounded-lg text-xs bg-stone-50 text-slate-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Office Street Address
              </label>
              <textarea
                rows={2}
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 border border-stone-300 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white font-bold text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Platform Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
