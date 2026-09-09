import React, { useState, useMemo } from 'react';
import { PropertyCard } from '../common/PropertyCard';
import { useStore } from '../../context/StoreContext';
import { CHITRAL_LOCATIONS } from '../../data/seedData';
import { 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal,
  RotateCcw,
  Heart,
  Grid3X3,
  Check
} from 'lucide-react';

interface PropertiesPageProps {
  initialFilterType?: string;
  onSelectProperty: (propertyId: string) => void;
  appliedSearchFilters?: {
    type?: string;
    location?: string;
    priceRange?: string;
  };
}

export const PropertiesPage: React.FC<PropertiesPageProps> = ({
  initialFilterType,
  onSelectProperty,
  appliedSearchFilters
}) => {
  const { properties, savedPropertyIds } = useStore();

  // Filters State
  const [selectedType, setSelectedType] = useState<string>(
    initialFilterType || appliedSearchFilters?.type || 'All'
  );
  const [selectedPurpose, setSelectedPurpose] = useState<string>('All');
  const [selectedLocation, setSelectedLocation] = useState<string>(
    appliedSearchFilters?.location || 'All'
  );
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>(
    appliedSearchFilters?.priceRange || 'All'
  );
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlySaved, setOnlySaved] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'newest'>('featured');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;

  // Filter Logic
  const filteredProperties = useMemo(() => {
    const seen = new Set<string>();
    return properties.filter((p) => {
      if (!p.id || seen.has(p.id)) return false;
      seen.add(p.id);

      // Must be Active for public page, or at least active/sold
      if (p.status === 'Pending Review') return false;

      // Filter by Type
      if (selectedType !== 'All' && p.type !== selectedType) {
        return false;
      }

      // Filter by Purpose (Buy / Rent)
      if (selectedPurpose === 'Buy' && p.purpose !== 'Sale') return false;
      if (selectedPurpose === 'Rent' && p.purpose !== 'Rent') return false;

      // Filter by Location
      if (selectedLocation !== 'All' && !p.location.includes(selectedLocation)) {
        return false;
      }

      // Filter by Price Range
      if (selectedPriceRange !== 'All') {
        if (selectedPriceRange === 'under-5m' && p.price > 5000000) return false;
        if (selectedPriceRange === '5m-15m' && (p.price < 5000000 || p.price > 15000000)) return false;
        if (selectedPriceRange === '15m-30m' && (p.price < 15000000 || p.price > 30000000)) return false;
        if (selectedPriceRange === 'above-30m' && p.price < 30000000) return false;
        if (selectedPriceRange === 'rent' && p.purpose !== 'Rent') return false;
      }

      // Filter by Saved
      if (onlySaved && !savedPropertyIds.includes(p.id)) {
        return false;
      }

      // Filter by text search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(query);
        const matchesLoc = p.location.toLowerCase().includes(query);
        const matchesDesc = p.description.toLowerCase().includes(query);
        const matchesSize = p.size.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLoc && !matchesDesc && !matchesSize) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return b.dateAdded.localeCompare(a.dateAdded);
      // default: featured first
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [
    properties,
    selectedType,
    selectedPurpose,
    selectedLocation,
    selectedPriceRange,
    searchQuery,
    onlySaved,
    savedPropertyIds,
    sortBy
  ]);

  // Reset page when filters change
  const handleFilterChange = (setter: (val: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSelectedType('All');
    setSelectedPurpose('All');
    setSelectedLocation('All');
    setSelectedPriceRange('All');
    setSearchQuery('');
    setOnlySaved(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredProperties.length / pageSize) || 1;
  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="w-full bg-[#f4f1ea] min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#2f6b3a] uppercase tracking-widest mb-1">
              <Grid3X3 className="w-4 h-4" />
              <span>Chitral Real Estate Marketplace</span>
            </div>
            <h1 className="font-serif-brand text-2xl sm:text-4xl font-bold text-[#0f2f45]">
              All Properties
            </h1>
            <p className="text-sm text-[#5b6672] mt-1">
              Explore our latest listings in Chitral — residential homes, commercial plots, and valley land.
            </p>
          </div>

          {/* Quick Saved Toggle & Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleFilterChange(setOnlySaved, !onlySaved)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all border ${
                onlySaved
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-sm'
                  : 'bg-white border-stone-200 text-slate-700 hover:bg-stone-50'
              }`}
            >
              <Heart className={`w-4 h-4 ${onlySaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
              <span>Saved Properties ({savedPropertyIds.length})</span>
            </button>

            <span className="text-xs font-semibold px-3 py-2 bg-stone-100 rounded-lg text-slate-700 border border-stone-200">
              {filteredProperties.length} Results
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-sm space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Property Type */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Property Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleFilterChange(setSelectedType, e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
              >
                <option value="All">All Types</option>
                <option value="House">House</option>
                <option value="Land">Land</option>
                <option value="Commercial">Commercial</option>
                <option value="Building">Building</option>
              </select>
            </div>

            {/* Purpose (Buy / Rent) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Purpose
              </label>
              <select
                value={selectedPurpose}
                onChange={(e) => handleFilterChange(setSelectedPurpose, e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
              >
                <option value="All">All Purposes</option>
                <option value="Buy">For Sale (Buy)</option>
                <option value="Rent">For Rent</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => handleFilterChange(setSelectedLocation, e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
              >
                <option value="All">All Chitral Areas</option>
                {CHITRAL_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Price Range
              </label>
              <select
                value={selectedPriceRange}
                onChange={(e) => handleFilterChange(setSelectedPriceRange, e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
              >
                <option value="All">All Price Ranges</option>
                <option value="under-5m">Under Rs. 50 Lakh (5M)</option>
                <option value="5m-15m">Rs. 50 Lakh – 1.5 Crore</option>
                <option value="15m-30m">Rs. 1.5 Crore – 3.0 Crore</option>
                <option value="above-30m">Above Rs. 3.0 Crore</option>
                <option value="rent">Rentals Only</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0f2f45] mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value as any)}
                className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-sm text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest Listed</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Search Input and Reset Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-stone-100">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleFilterChange(setSearchQuery, e.target.value)}
                placeholder="Search by keywords, road name, Marla, or features (e.g. 'Singoor', '10 Marla', 'Walnut')..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-[#0f2f45] focus:outline-none focus:ring-2 focus:ring-[#2f6b3a]"
              />
            </div>

            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 text-xs font-semibold text-slate-600 transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        {paginatedProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="font-serif-brand text-xl font-bold text-[#0f2f45]">
              No Matching Properties Found
            </h3>
            <p className="text-xs text-[#5b6672]">
              We couldn't find listings matching your specific criteria. Try loosening your filters or resetting the search.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-[#2f6b3a] text-white text-xs font-bold rounded-lg"
            >
              Clear All Filters
            </button>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500 font-medium">
              Showing page <span className="font-bold text-[#0f2f45]">{currentPage}</span> of{' '}
              <span className="font-bold text-[#0f2f45]">{totalPages}</span> ({filteredProperties.length} total properties)
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-stone-300 text-slate-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => {
                // Show condensed page numbers if many
                if (
                  num === 1 ||
                  num === totalPages ||
                  (num >= currentPage - 1 && num <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={num}
                      onClick={() => setCurrentPage(num)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-colors ${
                        currentPage === num
                          ? 'bg-[#2f6b3a] text-white shadow-sm'
                          : 'border border-stone-200 text-slate-700 hover:bg-stone-100'
                      }`}
                    >
                      {num}
                    </button>
                  );
                } else if (
                  num === currentPage - 2 ||
                  num === currentPage + 2
                ) {
                  return <span key={num} className="px-1 text-slate-400">...</span>;
                }
                return null;
              })}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-stone-300 text-slate-700 hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
