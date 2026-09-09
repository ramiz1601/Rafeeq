import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { PublicNavRoute } from '../../types';
import { useStore } from '../../context/StoreContext';
import { 
  Phone, 
  PlusCircle, 
  Menu, 
  X, 
  Lock, 
  Heart,
  Search,
  Building2,
  Home,
  Compass
} from 'lucide-react';

interface NavbarProps {
  currentRoute: PublicNavRoute;
  onNavigate: (route: PublicNavRoute, filterType?: string) => void;
  onOpenAdmin: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenAdmin,
  savedCount
}) => {
  const { settings, isAdminAuthenticated } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { label: string; route: PublicNavRoute; filter?: string }[] = [
    { label: 'Home', route: 'home' },
    { label: 'Properties', route: 'properties' },
    { label: 'Land', route: 'land', filter: 'Land' },
    { label: 'Houses', route: 'houses', filter: 'House' },
    { label: 'Commercial', route: 'commercial', filter: 'Commercial' },
    { label: 'Buildings', route: 'buildings', filter: 'Building' },
    { label: 'About', route: 'about' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleItemClick = (route: PublicNavRoute, filter?: string) => {
    onNavigate(route, filter);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0f2f45] text-white shadow-md border-b border-white/10">
      {/* Top subtle emergency/contact info strip */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 bg-[#0a202f] text-xs text-slate-300 border-b border-white/5">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Official Chitral Property Registry & Consultancy
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Markaz Rd, near Polo Grounds, Chitral</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('properties')}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Saved Properties ({savedCount})</span>
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={onOpenAdmin}
            id="top-admin-portal-button"
            className="flex items-center gap-1.5 text-slate-400 hover:text-emerald-300 transition-colors"
            title="Agency Portal"
          >
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            {isAdminAuthenticated && (
              <span className="text-[10px] text-emerald-400 font-semibold">(Active)</span>
            )}
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            className="cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <BrandLogo variant="light" size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.route, item.filter)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Phone + Lock Icon + List Property Button */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Phone Number with Phone Icon */}
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-white transition-colors px-2 py-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40"
            >
              <div className="w-7 h-7 rounded-full bg-[#2f6b3a] flex items-center justify-center text-white shrink-0 shadow-sm">
                <Phone className="w-3.5 h-3.5" />
              </div>
              <span className="tracking-wide">{settings.phone}</span>
            </a>

            {/* Sleek Lock Icon for Admin Access */}
            <button
              onClick={onOpenAdmin}
              id="admin-portal-lock-button"
              className={`relative p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-center group ${
                isAdminAuthenticated
                  ? 'bg-emerald-900/70 border-emerald-400/50 text-emerald-300 shadow-sm shadow-emerald-950 hover:bg-emerald-800'
                  : 'bg-slate-800/80 hover:bg-slate-700/90 border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400'
              }`}
              title={isAdminAuthenticated ? "Agency Portal (Logged In)" : "Agency Portal"}
              aria-label="Agency Portal"
            >
              <Lock className="w-4 h-4 transition-transform group-hover:scale-110" />
              {isAdminAuthenticated && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0f2f45] animate-pulse" />
              )}
            </button>

            {/* Green "List Your Property" button */}
            <button
              onClick={() => onNavigate('list-property')}
              className="flex items-center gap-2 bg-[#2f6b3a] hover:bg-[#25552e] text-white px-4 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all hover:shadow hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Property</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 xl:hidden">
            <button
              onClick={onOpenAdmin}
              id="mobile-admin-lock-button"
              className={`p-2 rounded-lg border transition-all flex items-center justify-center ${
                isAdminAuthenticated
                  ? 'bg-emerald-900/70 border-emerald-400/50 text-emerald-300'
                  : 'bg-slate-800 border-white/10 text-slate-300 hover:text-emerald-400'
              }`}
              title="Agency Portal"
              aria-label="Agency Portal"
            >
              <Lock className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('list-property')}
              className="sm:hidden flex items-center gap-1 bg-[#2f6b3a] text-white text-xs font-semibold px-2.5 py-1.5 rounded-md"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>List</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#0d273a] border-t border-white/10 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item.route, item.filter)}
                  className={`text-left px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-700 text-white font-semibold'
                      : 'text-slate-200 hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-white/10 text-emerald-300 text-sm font-semibold"
            >
              <Phone className="w-4 h-4" />
              <span>Call {settings.phone}</span>
            </a>

            <button
              onClick={() => {
                onNavigate('list-property');
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-[#2f6b3a] hover:bg-[#25552e] text-white text-sm font-semibold shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your Property</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold"
            >
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Agency Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
