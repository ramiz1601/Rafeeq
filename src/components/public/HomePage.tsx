import React, { useMemo } from 'react';
import { HeroSearch } from './HeroSearch';
import { PropertyCard } from '../common/PropertyCard';
import { useStore } from '../../context/StoreContext';
import { PublicNavRoute } from '../../types';
import { 
  ShoppingBag, 
  Tag, 
  KeyRound, 
  TrendingUp, 
  ArrowRight, 
  MapPin, 
  Phone, 
  CheckCircle,
  Building2,
  TreePine,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (route: PublicNavRoute, filterType?: string) => void;
  onSelectProperty: (propertyId: string) => void;
  onApplySearchFilters?: (filters: { type?: string; location?: string; priceRange?: string }) => void;
  onSearch?: (filters: { type?: string; location?: string; priceRange?: string }) => void;
  onOpenAdmin?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProperty,
  onApplySearchFilters,
  onSearch,
  onOpenAdmin
}) => {
  const { properties, settings, isAdminAuthenticated } = useStore();

  const handleHeroSearch = (filters: { type?: string; location?: string; priceRange?: string }) => {
    if (onApplySearchFilters) onApplySearchFilters(filters);
    if (onSearch) onSearch(filters);
    onNavigate('properties');
  };

  // Active featured properties or recent properties
  const featuredProperties = useMemo(() => {
    const seen = new Set<string>();
    return properties
      .filter((p) => {
        if (!p.id || seen.has(p.id)) return false;
        seen.add(p.id);
        return p.status === 'Active';
      })
      .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
      .slice(0, 6);
  }, [properties]);

  // Four service cards with icons
  const serviceCards = [
    {
      title: 'Buy',
      actionText: 'Find your dream property',
      desc: 'Residential villas, prime orchard lands, and commercial shops with 100% verified legal land titles (Fard & Intiqal).',
      icon: ShoppingBag,
      filter: undefined,
      route: 'properties' as PublicNavRoute
    },
    {
      title: 'Sell',
      actionText: 'Get the best value',
      desc: 'Reach serious buyers across Chitral, Islamabad, and overseas Chitrali diaspora. Free market valuation & rapid deal closure.',
      icon: Tag,
      filter: undefined,
      route: 'list-property' as PublicNavRoute
    },
    {
      title: 'Rent',
      actionText: 'Flexible options for you',
      desc: 'Quality family homes, office suites, executive apartments, and commercial shops with fair tenancy agreements.',
      icon: KeyRound,
      filter: 'Rent',
      route: 'properties' as PublicNavRoute
    },
    {
      title: 'Invest',
      actionText: 'Build a better future',
      desc: 'High-growth tourism corridors in Ayun, Garam Chashma, and highway bypass commercial plots with rapid capital appreciation.',
      icon: TrendingUp,
      filter: 'Land',
      route: 'properties' as PublicNavRoute
    }
  ];

  return (
    <div className="w-full space-y-16 pb-12">
      {/* 1. Hero Section with Search Bar and Stats */}
      <HeroSearch
        onSearch={handleHeroSearch}
      />

      {/* 2. Four Service Cards Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#2f6b3a] block mb-1">
            Our Core Specializations
          </span>
          <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#0f2f45]">
            Comprehensive Real Estate Services in Chitral
          </h2>
          <p className="text-sm text-[#5b6672] mt-2">
            Tailored property consultancy grounded in deep local community trust, revenue records, and professional execution.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {serviceCards.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                onClick={() => onNavigate(service.route, service.filter)}
                className="group relative bg-white rounded-xl p-6 border border-stone-200 shadow-sm hover:shadow-xl hover:border-[#2f6b3a]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#0f2f45]/5 text-[#2f6b3a] group-hover:bg-[#2f6b3a] group-hover:text-white transition-colors duration-300 flex items-center justify-center mb-4 shadow-inner">
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-serif-brand text-xl font-bold text-[#0f2f45]">
                      {service.title}
                    </h3>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Expertise
                    </span>
                  </div>

                  <div className="text-xs font-bold text-[#2f6b3a] mb-2">
                    "{service.actionText}"
                  </div>

                  <p className="text-xs text-[#5b6672] leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#0f2f45] group-hover:text-[#2f6b3a] transition-colors">
                  <span>Explore Options</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Featured / All Properties Preview Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#2f6b3a] block mb-1">
              Hand-Picked Opportunities
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-3xl font-bold text-[#0f2f45]">
              Featured Properties in Chitral
            </h2>
            <p className="text-sm text-[#5b6672]">
              Verified titles, prime locations, and negotiated directly with property owners.
            </p>
          </div>

          <button
            onClick={() => onNavigate('properties')}
            className="flex items-center gap-2 text-sm font-bold text-[#2f6b3a] hover:text-[#0f2f45] transition-colors shrink-0"
          >
            <span>View All {properties.filter(p => p.status === 'Active').length} Active Listings</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Property Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onSelectProperty}
            />
          ))}
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <button
            onClick={() => onNavigate('properties')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#0f2f45] hover:bg-[#163f5c] text-white text-sm font-semibold shadow-md transition-all hover:shadow-lg hover:-translate-y-0.5"
          >
            <span>Browse Complete Chitral Property Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. Why Chitral & Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0f2f45] rounded-2xl text-white p-8 sm:p-12 relative overflow-hidden shadow-xl border border-white/10">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none hidden md:block">
            <svg viewBox="0 0 400 400" className="w-full h-full" fill="currentColor">
              <polygon points="200,50 350,350 50,350" />
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
              Chitral — Land of Opportunities
            </span>
            <h2 className="font-serif-brand text-2xl sm:text-4xl font-bold leading-tight">
              Invest Securely with Local Chitrali Experts
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              With the opening of Lowari Tunnel and expanding ecotourism, Chitral property values have experienced reliable appreciation. Rafeeq Homes and Properties ensures every transaction is thoroughly vetted with local Patwari and registry authorities.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
              <div className="flex items-center gap-2 text-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Clean Fard & Intiqal Registry</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Hidden Fees or Disputes</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <TreePine className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Prime Tourist & Orchard Belts</span>
              </div>
              <div className="flex items-center gap-2 text-slate-200">
                <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Physical Site Visit Support</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('list-property')}
                className="px-5 py-2.5 rounded-lg bg-[#2f6b3a] hover:bg-[#25552e] text-white text-sm font-semibold transition-all shadow-md"
              >
                List Your Property with Us
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all border border-white/20"
              >
                Schedule Agency Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Agency Administration Quick Access on Main Page */}
      {onOpenAdmin && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0f2f45] via-[#163f5c] to-[#0f2f45] rounded-2xl p-6 text-white border border-white/15 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                    Agency Administration & Management
                  </span>
                  {isAdminAuthenticated && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/90 text-emerald-200 border border-emerald-400/40 text-[10px] font-bold">
                      Session Active
                    </span>
                  )}
                </div>
                <h3 className="font-serif-brand text-lg sm:text-xl font-bold text-white mt-0.5">
                  Rafeeq Homes Admin Portal
                </h3>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Review new client property submissions awaiting approval, manage buyers & sellers CRM, record closed deals, and access accounting ledgers.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAdmin}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2f6b3a] hover:bg-[#25552e] text-white font-bold text-xs shadow-md transition-all shrink-0 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>{isAdminAuthenticated ? 'Open Admin Dashboard' : 'Access Admin Portal'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </section>
      )}

      {/* 6. Contact Strip / Footer Info */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100 rounded-xl p-6 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#0f2f45] text-white flex items-center justify-center shrink-0 shadow-sm">
              <MapPin className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-[#2f6b3a]">
                Headquarters Address
              </div>
              <div className="font-semibold text-sm text-[#0f2f45]">
                {settings.address}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2f6b3a] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider font-bold text-slate-500">
                Direct Hotline / WhatsApp
              </div>
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="font-bold text-base text-[#0f2f45] hover:text-[#2f6b3a]"
              >
                {settings.phone}
              </a>
            </div>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="w-full md:w-auto px-5 py-2.5 rounded-lg bg-[#0f2f45] hover:bg-[#184666] text-white text-sm font-semibold shrink-0"
          >
            Visit Our Office
          </button>
        </div>
      </section>
    </div>
  );
};
