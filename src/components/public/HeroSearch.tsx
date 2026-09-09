import React, { useState } from 'react';
import { PropertyType } from '../../types';
import { CHITRAL_LOCATIONS } from '../../data/seedData';
import { 
  Search, 
  MapPin, 
  Home, 
  BadgePercent, 
  Building, 
  Users, 
  Handshake, 
  Award,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface HeroSearchProps {
  onSearch: (filters: {
    type?: string;
    location?: string;
    priceRange?: string;
  }) => void;
  onSelectService?: (serviceType: string) => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({ onSearch, onSelectService }) => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      type: selectedType === 'All' ? undefined : selectedType,
      location: selectedLocation === 'All' ? undefined : selectedLocation,
      priceRange: selectedPriceRange === 'All' ? undefined : selectedPriceRange
    });
  };

  return (
    <div className="relative w-full">
      {/* Full-width mountain landscape background image */}
      <div 
        className="relative w-full min-h-[580px] lg:min-h-[640px] bg-cover bg-center flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8"
        style={{
          // Authentic majestic Northern Pakistan / Hindu Kush mountain valley landscape
          backgroundImage: `linear-gradient(to bottom, rgba(15, 47, 69, 0.82), rgba(15, 47, 69, 0.88)), url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85')`
        }}
      >
        {/* Subtle decorative mountain peak lines */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(47,107,58,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 text-xs font-bold uppercase tracking-widest shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>PREMIUM REAL ESTATE SERVICES IN CHITRAL</span>
          </div>

          {/* Headline */}
          <h1 className="font-serif-brand text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Find Your Dream Property in Chitral
          </h1>

          {/* Subtext */}
          <p className="max-w-3xl mx-auto text-base sm:text-lg text-slate-200 font-normal leading-relaxed">
            Whether you're buying, selling, renting or investing — Rafeeq Homes and Properties is your trusted partner in real estate.
          </p>

          {/* Search bar with 4 fields */}
          <div className="pt-4 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-2xl shadow-2xl border border-stone-200/90 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left"
            >
              {/* Field 1: Property Type */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#0f2f45] uppercase tracking-wider flex items-center gap-1">
                  <Home className="w-3.5 h-3.5 text-[#2f6b3a]" />
                  <span>Property Type</span>
                </label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] font-medium focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                >
                  <option value="All">All Types</option>
                  <option value="House">House</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Building">Building</option>
                </select>
              </div>

              {/* Field 2: Location (dropdown of Chitral areas) */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#0f2f45] uppercase tracking-wider flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#2f6b3a]" />
                  <span>Chitral Location</span>
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] font-medium focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                >
                  <option value="All">All Chitral Areas</option>
                  {CHITRAL_LOCATIONS.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </div>

              {/* Field 3: Price Range */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-[#0f2f45] uppercase tracking-wider flex items-center gap-1">
                  <BadgePercent className="w-3.5 h-3.5 text-[#2f6b3a]" />
                  <span>Budget / Price</span>
                </label>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] font-medium focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
                >
                  <option value="All">Any Budget</option>
                  <option value="under-5m">Under Rs. 50 Lakh (5M)</option>
                  <option value="5m-15m">Rs. 50 Lakh – 1.5 Crore</option>
                  <option value="15m-30m">Rs. 1.5 Crore – 3.0 Crore</option>
                  <option value="above-30m">Above Rs. 3.0 Crore</option>
                  <option value="rent">Rentals Only</option>
                </select>
              </div>

              {/* Field 4: Green "Search" button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full h-[42px] bg-[#2f6b3a] hover:bg-[#25552e] text-white rounded-lg text-sm font-bold shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] active:scale-[0.99]"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>

          {/* Stats row below the search bar */}
          {/* "100+ Properties Listed", "50+ Happy Clients", "30+ Successful Deals", "Trusted Local Expert" — each with a simple icon */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {[
              { label: 'Properties Listed', stat: '100+', icon: Building },
              { label: 'Happy Clients', stat: '50+', icon: Users },
              { label: 'Successful Deals', stat: '30+', icon: Handshake },
              { label: 'Trusted Local Expert', stat: 'SECP Verified', icon: Award }
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.label}
                  className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3 sm:p-4 text-center text-white"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xl sm:text-2xl font-bold font-serif-brand text-white">
                    {s.stat}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
