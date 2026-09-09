import React from 'react';
import { BrandLogo } from './BrandLogo';
import { PublicNavRoute } from '../../types';
import { useStore } from '../../context/StoreContext';
import { MapPin, Phone, Mail, Clock, ArrowRight, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (route: PublicNavRoute, filterType?: string) => void;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#0f2f45] text-white pt-16 pb-8 border-t-4 border-[#2f6b3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <BrandLogo variant="light" size="lg" showTagline={false} />
            <p className="text-emerald-400 font-serif-brand text-sm tracking-wide font-medium">
              "{settings.tagline}"
            </p>
            <p className="text-slate-300 text-sm leading-relaxed">
              Chitral’s premier real estate consultancy. We bridge authentic buyers and sellers with verified land registries, transparent pricing, and trusted legal guidance across Hindu Kush valleys.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                PVT LTD SECP Registered
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-slate-300 text-xs font-medium">
                Local Chitrali Team
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-emerald-400 font-serif-brand border-b border-white/10 pb-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm text-slate-300">
              {[
                { label: 'Home', route: 'home' as PublicNavRoute },
                { label: 'All Properties', route: 'properties' as PublicNavRoute },
                { label: 'Agricultural & Scenic Land', route: 'land' as PublicNavRoute, filter: 'Land' },
                { label: 'Residential Houses & Villas', route: 'houses' as PublicNavRoute, filter: 'House' },
                { label: 'Commercial Plots & Shops', route: 'commercial' as PublicNavRoute, filter: 'Commercial' },
                { label: 'Plazas & Buildings', route: 'buildings' as PublicNavRoute, filter: 'Building' },
                { label: 'About Us', route: 'about' as PublicNavRoute },
                { label: 'Contact Us', route: 'contact' as PublicNavRoute }
              ].map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => onNavigate(link.route, link.filter)}
                    className="flex items-center gap-1.5 hover:text-emerald-300 transition-colors hover:translate-x-1 duration-150 text-left"
                  >
                    <ArrowRight className="w-3 h-3 text-emerald-500 shrink-0" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact Us */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-emerald-400 font-serif-brand border-b border-white/10 pb-2">
              Contact Us
            </h3>
            <ul className="space-y-3.5 text-sm text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white font-medium">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-center gap-3 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Mon – Sat: 8:30 AM – 7:00 PM</span>
              </li>
            </ul>

            <div className="pt-2">
              <button
                onClick={() => onNavigate('list-property')}
                className="w-full text-center py-2 px-3 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-xs font-semibold transition-colors shadow-sm"
              >
                Submit Your Property for Listing
              </button>
            </div>
          </div>

          {/* Column 4: Chitral — Land of Opportunities over mountain background */}
          <div className="relative rounded-xl overflow-hidden border border-white/15 bg-gradient-to-b from-[#0a202f] to-[#12364f] p-6 flex flex-col justify-between shadow-lg">
            {/* Mountain silhouette overlay background */}
            <div 
              className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-overlay"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80')`
              }}
            />
            
            <div className="relative z-10">
              <span className="text-[11px] uppercase tracking-widest text-emerald-400 font-semibold block mb-1">
                Regional Pride
              </span>
              <h4 className="font-serif-brand text-2xl text-white italic font-bold tracking-wide leading-tight">
                Chitral — Land of Opportunities
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                From scenic apple orchards along the Kunar River to commercial hubs in Ataliq & Shahi Bazars, secure your future in the golden valley of the Hindu Kush.
              </p>
            </div>

            <div className="relative z-10 pt-4 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-[11px] text-emerald-300 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Licensed Real Estate Firm in KPK
              </span>
              {onOpenAdmin && (
                <button
                  onClick={onOpenAdmin}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-emerald-600 hover:text-white transition-colors text-[11px] text-slate-200 border border-white/10 font-medium"
                  title="Agency Portal"
                >
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Agency Portal</span>
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Rafeeq Homes and Properties (PVT LTD). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>NTN & SECP Verified</span>
            <span>Chitral, Khyber Pakhtunkhwa, Pakistan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
